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

  const hasDiscount = (discountPercentage) => {
    return discountPercentage > 0 ? true : false;
  };

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
              <Text style={styles.title}>{item.title}</Text>
              <Text
                style={[
                  styles.price,
                  hasDiscount(item.discountPercentage) && styles.discount,
                ]}
              >
                {formatCurrencyWithCommas(item.originalPrice)}
              </Text>
              {hasDiscount(item.discountPercentage) && (
                <>
                  <Text style={styles.text}>
                    {item.discountPercentage}% off
                  </Text>
                  <Text style={[styles.price]}>
                    {formatCurrencyWithCommas(item.currentPrice)}
                  </Text>
                </>
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
    fontWeight: 500,
  },
});
