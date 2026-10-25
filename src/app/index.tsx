import { calculateDistance } from "../utils/calculateDistance";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./homeStyles";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const shopLatitude = 34.7;
  const shopLongitude = 135.5;

  const distance =
    latitude !== null && longitude !== null
      ? calculateDistance(latitude, longitude, shopLatitude, shopLongitude)
      : null;
  async function saveItems(newItems: string[]) {
    try {
      await AsyncStorage.setItem("shoppingItems", JSON.stringify(newItems));
    } catch (error) {
      console.error("保存エラー:", error);
    }
  }

  async function deleteItem(index: number) {
    const newItems = items.filter((_, i) => i !== index);

    setItems(newItems);

    await saveItems(newItems);
  }

  async function addItem() {
    const name = itemName.trim();

    if (name === "") {
      return;
    }

    const newItems = [...items, name];

    setItems(newItems);
    setItemName("");

    await saveItems(newItems);
  }
  async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      alert("通知が許可されていません");
      return;
    }

    alert("通知が許可されました");
  }

  async function sendTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "買い物リマインダー",
          body: "牛乳を買い忘れていませんか？",
        },
        trigger: null,
      });
    } catch (error) {
      console.error("通知エラー:", error);
    }
  }

  useEffect(() => {
    async function loadItems() {
      try {
        const savedItems = await AsyncStorage.getItem("shoppingItems");

        if (savedItems !== null) {
          setItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error("読み込みエラー:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadItems();
  }, []);
  async function getCurrentLocation() {
    try {
      // 位置情報の使用許可を求める
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("位置情報の使用が許可されていません");
        return;
      }

      // 現在地を取得
      const location = await Location.getCurrentPositionAsync({});

      // Stateに保存
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      console.error("位置情報取得エラー:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>買い物リマインダー</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="商品名を入力"
          value={itemName}
          onChangeText={setItemName}
        />

        <Pressable style={styles.button} onPress={addItem} disabled={isLoading}>
          <Text style={styles.buttonText}>追加</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>買い物リスト</Text>
      <Pressable style={styles.button} onPress={requestNotificationPermission}>
        <Text style={styles.buttonText}>通知を許可する</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={sendTestNotification}>
        <Text style={styles.buttonText}>テスト通知を送る</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>現在地を取得</Text>
      </Pressable>
      <Text>緯度：{latitude ?? "未取得"}</Text>
      <Text>経度：{longitude ?? "未取得"}</Text>
      <Text>
        店舗までの距離：
        {distance !== null ? `${Math.round(distance)}m` : "未取得"}
      </Text>
      <Pressable style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>現在地を取得</Text>
      </Pressable>
      ;
      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.item}>{item}</Text>

          <Pressable onPress={() => deleteItem(index)} disabled={isLoading}>
            <Text style={styles.deleteText}>削除</Text>
          </Pressable>
        </View>
      ))}
    </SafeAreaView>
  );
}
