import React from "react";
import { View, StyleSheet } from "react-native";

import Input from "./Input";
import Text from "./Text";
import { formatCurrencyWithCommas } from "../utils/helper";

const TicketCard = ({ ticketInfo, setTicketInfo, item }) => {
  const hasDiscount = item?.discount_rate > 0;
  const originalPrice = hasDiscount
    ? Math.round(item?.price / (1 - item?.discount_rate / 100))
    : item?.price;

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <Text
            value={item?.title || "N/A"}
            variant="body"
            style={{ fontWeight: "bold", marginRight: 2 }}
          />
        </View>
        <View style={styles.priceContainer}>
          {hasDiscount ? (
            <View style={styles.row}>
              <Text
                value={`KES ${formatCurrencyWithCommas(originalPrice)}`}
                variant="body"
                style={styles.oldPrice}
              />
              <Text
                value={`${Math.round(item?.discount_rate)}% off`}
                variant="body"
                style={styles.discount}
              />
              <Text
                value={`KES ${formatCurrencyWithCommas(item?.price)}`}
                variant="body"
                style={styles.newPrice}
              />
            </View>
          ) : (
            <Text
              value={`KES ${formatCurrencyWithCommas(item?.price)}`}
              variant="body"
              style={styles.newPrice}
            />
          )}
        </View>
      </View>
      <View>
        <Text value={`Select ticketInfo`} variant="body" />
        <Input
          placeholder="0"
          type="number-pad"
          returnKeyType="done"
          defaultValue={ticketInfo.ticketInfo}
          onChange={(text) => {
            const quantity = parseInt(text, 10);
            setTicketInfo({
              quantity,
              ticket_type: item.id,
              amount_paid: item.price,
            });
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
    borderWidth: 1,
    borderColor: "#c3c3c3",
    width: "100%",
    maxWidth: 100,
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
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
