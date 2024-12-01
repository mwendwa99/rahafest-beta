import { formatCurrency } from "@/utils";
import React, { useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

interface TicketListProps {
  title: string;
  price: string;
  quantity: number;
  setQuantity: (input: number) => void;
}

export default function TicketList({
  title,
  price,
  quantity = 0,
  setQuantity,
}: TicketListProps) {
  const handleInputChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      setQuantity(num);
    }
  };

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.column}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>KES {formatCurrency(price)}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={quantity.toString()}
            onChangeText={handleInputChange}
            placeholder="0"
            maxLength={2}
            returnKeyType="done"
            onSubmitEditing={dismissKeyboard}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginRight: 15,
  },
  title: {
    color: "#fafafa",
    fontWeight: "600",
  },
  subtitle: {
    color: "#d3d3d3",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  input: {
    minWidth: 50,
    height: 40,
    backgroundColor: "#c3c3c3",
    textAlign: "center",
    color: "#000",
    borderRadius: 5,
    padding: 5,
  },
});
