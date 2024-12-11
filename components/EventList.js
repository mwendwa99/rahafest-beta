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
  tickets,
  hideDiscounted = false,
  isActive,
}) {
  const hasDiscount = (discount_rate) => {
    return discount_rate > 0 ? true : false;
  };

  // console.log(title, isActive);

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

  // Filter tickets based on hideDiscounted prop
  const filteredTickets = hideDiscounted
    ? tickets.filter(
        (ticket) =>
          !hasDiscount(ticket.discount_rate) &&
          ticket.is_active &&
          ticket.id !== 22
      )
    : tickets.filter(
        (ticket) =>
          hasDiscount(ticket.discount_rate) &&
          ticket.is_active &&
          ticket.id !== 22
      );

  // console.log(JSON.stringify(filteredTickets));

  return (
    <View style={styles.container}>
      <Pressable
        disabled={expired}
        onPress={onPress}
        style={styles.mainContent}
      >
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

      {/* <View style={styles.ticketContainer}>
        <FlatList
          data={filteredTickets}
          keyExtractor={({ item }) => item?.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={styles.ticket}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={{ flexDirection: "row" }}>
                {hasDiscount(item.discount_rate) && (
                  <Text
                    style={[
                      styles.price,
                      hasDiscount(item.discount_rate) && styles.discount,
                    ]}
                  >
                    {calculateOriginalPrice(item.price, item.discount_rate)}
                  </Text>
                )}
                <Text style={[styles.price]}>
                  {`${formatCurrencyWithCommas(item.price)}`}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text>Tickets will be available soon!</Text>
          )}
        />
      </View> */}
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
    // borderRadius: 8,
    overflow: "hidden",
  },
  mainContent: {
    // padding: 16,
  },
  // ticketContainer: {
  //   paddingHorizontal: 16,
  //   paddingBottom: 16,
  // },
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
    // width: 40,
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
    fontSize: 10,
    color: "red",
    textDecorationLine: "line-through",
  },
  price: {
    fontWeight: 700,
  },
});
