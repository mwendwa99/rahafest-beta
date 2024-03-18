import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ onPress, label }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    width: 100,
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
