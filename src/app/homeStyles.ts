
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  itemRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
deleteText: {
  color: "#ef4444",
  fontWeight: "bold",
  padding: 12,
},
});
