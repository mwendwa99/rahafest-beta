import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
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
  tickets,
}) {
  console.log(JSON.stringify(tickets));

  const hasDiscount = (discount_rate) => {
    console.log({ discount_rate });
    return discount_rate > 0 ? true : false;
  };

  function calculateOriginalPrice(price, discount_rate) {
    // Convert price and discount_rate to numbers
    const numericPrice = Number(price) || 0; // Default to 0 if conversion fails
    const numericDiscountRate = Number(discount_rate) || 0; // Default to 0 if conversion fails

    // Handle case where discount_rate is 0 or null
    if (numericDiscountRate === 0) {
      return numericPrice.toFixed(2); // Return as a string with 2 decimal places
    }

    // Calculate the original price
    const originalPrice = numericPrice / (1 - numericDiscountRate / 100);
    let finalPrice = formatCurrencyWithCommas(originalPrice);
    return finalPrice;
  }

  return (
    <TouchableOpacity
      disabled={expired}
      style={[styles.container]}
      onPress={onPress}
    >
      {expired && (
        <View style={styles.chip}>
          <Text style={styles.text}>expired</Text>
        </View>
      )}
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.column}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text>Location: {location}</Text>
        <Text>{date}</Text>
      </View>
      <View style={styles.row}>
        <FlatList
          data={tickets}
          keyExtractor={({ item }) => item?.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.ticket}>
              <Text style={styles.title}>
                {item.title}
                {/* {hasDiscount(item.discount_rate) ? "true" : "false"} */}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.price,
                    hasDiscount(item.discount_rate) && styles.discount,
                  ]}
                >
                  {`${formatCurrencyWithCommas(item.price)}`}
                </Text>
                <Text
                  style={[
                    styles.text,
                    hasDiscount(item.discount_rate) && {
                      color: "red",
                      fontWeight: 700,
                    },
                  ]}
                >
                  {hasDiscount(item.discount_rate)
                    ? ` ${item.discount_rate}% off`
                    : null}
                </Text>
              </View>
              {hasDiscount(item.discount_rate) && (
                <Text style={[styles.price]}>
                  {calculateOriginalPrice(item.price, item.discount_rate)}
                </Text>
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <Text>Tickets will be available soon!</Text>
          )}
          horizontal
        />
      </View>
    </TouchableOpacity>
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
    // fontSize: 18,
  },
  subtitle: {
    fontSize: 12,
    color: "grey",
  },
  discount: {
    color: "red",
    textDecorationLine: "line-through",
  },
  price: {
    fontWeight: 700,
  },
});
