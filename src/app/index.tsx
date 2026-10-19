import { styles } from "./homeStyles";
import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<string[]>([]);

  function addItem() {
    if (itemName.trim() === "") {
      return;
    }

    setItems([...items, itemName.trim()]);
    setItemName("");
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

        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>追加</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>買い物リスト</Text>

      {items.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item}
        </Text>
      ))}
    </SafeAreaView>
  );
}
