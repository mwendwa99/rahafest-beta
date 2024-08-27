import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function MerchCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={product.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>KES {product.price}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Alert.alert(`You'll be able to buy ${product.name} soon`)
          }
        >
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    width: 175,
    backgroundColor: "#fff",
    color: "#fafafa",
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    objectFit: "contain"
  },
  infoContainer: {
    padding: 16,
    width: "100%",
  },
  name: {
    fontSize: 16,
    fontWeight: "thin",
    marginBottom: 5,
    color: "#1b1b1b",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b1b1b",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F4A329",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#212529",
    fontSize: 16,
  },
});
