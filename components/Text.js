import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function RNText({ value, variant, style, ...props }) {
  return (
    <Text {...props} style={[styles[variant], style]}>
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  heading: {
    fontSize: 24,
    marginBottom: 6,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  subheading: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  body: {
    fontSize: 16,
  },
  small: {
    fontSize: 12,
    color: "#6f6f6f",
  },
  important: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  input: {
    marginBottom: 4,
    textTransform: "capitalize",
  },
});
