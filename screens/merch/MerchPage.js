// MerchandisePage.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator, // Import ActivityIndicator from react-native
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formatCurrencyWithCommas } from "../../utils/helper";
import api from "../../services/api.service"; // Import your api service

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / 2; // 2 cards per row with 16px padding on sides

const MerchandiseCard = ({ item }) => {
  const navigation = useNavigation();
  const discountedPrice = item.price * (1 - item.discount_rate / 100); // discount_rate is not in the response, keep it for now, might be unused

  // console.log(item);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ItemPage", { item })}
      // onPress={() => alert("Coming soon!")}
    >
      <Image
        source={{ uri: item.featured_image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Kes. {formatCurrencyWithCommas(parseInt(item?.price))}
          </Text>
        </View>
        <View>
          <Text style={styles.merchant}>{item?.merchant?.name}</Text>
        </View>
        <View style={styles.ratingContainer}></View>
      </View>
    </TouchableOpacity>
  );
};

const MerchandisePage = () => {
  const renderItem = ({ item }) => <MerchandiseCard item={item} />;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [products, setProducts] = useState([]); // ADD STATE FOR PRODUCTS
  const [loading, setLoading] = useState(false); // ADD STATE FOR LOADING

  useEffect(() => {
    loadProducts(); // Call loadProducts function on component mount
  }, []);

  const loadProducts = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await api.get("/all-products"); // Use api service to fetch data
      if (response.data.status === "success") {
        setProducts(response.data.data.items); // Update products state with fetched items
      } else {
        console.error("Failed to load products:", response.data.message);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false); // Set loading to false after API call completes (success or error)
      setIsRefreshing(false); // Stop refreshing animation
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadProducts(); // Call loadProducts function on refresh
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products} // Use products state for FlatList data
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
      {/* <Text>Cart</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: cardWidth,
  },
  cardContent: {
    padding: 8,
  },
  merchant: {
    color: "#8888",
    fontSize: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  vipBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vipText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default MerchandisePage;
