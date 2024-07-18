import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function ButtonComponent({
  onPress,
  label,
  disabled,
  variant,
  ...props
}) {
  return (
    <Button
      {...props}
      onPress={onPress}
      disabled={disabled}
      mode={variant}
      style={styles[variant]}
      labelStyle={styles[`${variant}Label`]}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  contained: {
    backgroundColor: "#B9052C",
    marginVertical: 10,
    color: "#fff",
  },
  text: {
    marginVertical: 10,
  },
  outlined: {
    marginVertical: 10,
  },
  containedLabel: {
    color: "white",
  },
  textLabel: {
    color: "white",
  },
});
