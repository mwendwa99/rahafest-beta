import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ onPress, label, color, disabled }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ ...styles.button, backgroundColor: color }}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    padding: 10,
    margin: 10,
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
