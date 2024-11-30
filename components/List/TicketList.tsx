import { formatCurrency } from "@/utils";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface TicketListProps {
  title: string;
  price: string;
  quantity: number;
  setQuantity: (input: number) => void;
}

export default function TicketList({
  title,
  price,
  quantity,
  setQuantity,
}: TicketListProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.column}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>KES {formatCurrency(price)}</Text>
        </View>
        <Picker
          selectedValue={quantity}
          onValueChange={(itemValue) => setQuantity(itemValue)}
          style={styles.input}
        >
          {Array.from({ length: 11 }, (_, index) => (
            <Picker.Item key={index} label={`${index}`} value={index} />
          ))}
        </Picker>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    color: "#fafafa",
    fontWeight: 600,
  },
  subtitle: {
    color: "#d3d3d3",
  },
  input: {
    minWidth: 100,
    height: 50,
    backgroundColor: "#c3c3c3",
  },
});
