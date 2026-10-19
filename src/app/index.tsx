import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./homeStyles";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<string[]>([]);
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
