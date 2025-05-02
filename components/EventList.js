import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { formatCurrencyWithCommas } from "../utils/helper";

export default function EventList({
  title,
  subtitle,
  onPress,
  date,
  location,
  image,
  expired,
  isLargeScreen,
}) {
  const hasDiscount = (discount_rate) => {
    return discount_rate > 0 ? true : false;
  };

  function calculateOriginalPrice(price, discount_rate) {
    const numericPrice = Number(price) || 0;
    const numericDiscountRate = Number(discount_rate) || 0;

    if (numericDiscountRate === 0) {
      return numericPrice.toFixed(2);
    }

    const originalPrice = numericPrice / (1 - numericDiscountRate / 100);
    let finalPrice = formatCurrencyWithCommas(originalPrice);
    return finalPrice;
  }

  return (
    <View
      style={[styles.container, { maxWidth: isLargeScreen ? "48%" : "100%" }]}
    >
      <Pressable disabled={expired} onPress={onPress}>
        {expired && (
          <View style={styles.chip}>
            <Text style={styles.text}>expired</Text>
          </View>
        )}
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.column}>
          <Text style={styles.title}>{title}</Text>
          <Text>{date}</Text>
          <Text>{location}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#c3c3c3",
    padding: 10,
    flexDirection: "column",
    marginVertical: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
    flex: 1,
    margin: 8,
    minWidth: 160,
    // maxWidth: "48%",
  },
  chip: {
    backgroundColor: "#fafafa",
    width: 70,
    height: 30,
    display: "flex",
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c3c3c3",

    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 100,
  },
  column: {
    marginVertical: 2,
    flexDirection: "column",
  },
  row: {
    marginVertical: 2,
    flexDirection: "row",
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 10,
  },
  ticket: {
    marginVertical: 2,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#c3c3c3",
    padding: 5,
    margin: 2,
    borderRadius: 10,
  },
  title: {
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    color: "grey",
  },
  discount: {
    fontSize: 10,
    color: "red",
    textDecorationLine: "line-through",
  },
  price: {
    fontWeight: 700,
  },
});
