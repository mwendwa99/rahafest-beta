import React from "react";
import { View, StyleSheet } from "react-native";

import Input from "./Input";
import Text from "./Text";
import { formatCurrencyWithCommas } from "../utils/helper";

const TicketCard = ({ handleSelectTicketQuantity, item }) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <Text
            value={item?.title || "N/A"}
            variant="body"
            style={{ fontWeight: "bold", marginRight: 2 }}
          />
          {item?.discount_price > 0 && (
            <View style={styles.row}>
              <Text
                value={`${Math.round(item?.discount_rate)}% off`}
                variant="body"
                style={styles.discount}
              />
            </View>
          )}
        </View>
        <View style={styles.priceContainer}>
          {item?.discount_price > 0 ? (
            <View style={styles.row}>
              <Text
                value={`KES ${formatCurrencyWithCommas(item?.price)}`}
                variant="body"
                style={styles.oldPrice}
              />
              <Text
                value={`KES ${formatCurrencyWithCommas(item?.discount_price)}`}
                variant="body"
                style={styles.newPrice}
              />
            </View>
          ) : (
            <Text
              value={`KES ${formatCurrencyWithCommas(item?.price)}`}
              variant="body"
            />
          )}
        </View>
      </View>
      <View>
        <Text value={`Select quantity`} variant="body" />
        <Input
          placeholder="0"
          type="number-pad"
          returnKeyType="done"
          defaultValue="0"
          onChange={(text) => {
            const quantity = parseInt(text, 10) || 0;
            handleSelectTicketQuantity(quantity, item);
          }}
          onSubmitEditing={(e) => {
            const quantity = parseInt(e.nativeEvent.text, 10) || 0;
            handleSelectTicketQuantity(quantity, item); // Confirm the quantity on return key
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: "300",
    textDecorationLine: "line-through",
    color: "grey",
    marginEnd: 5,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TicketCard;
