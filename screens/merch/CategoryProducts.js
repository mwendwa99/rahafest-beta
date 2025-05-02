import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function CategoryProducts({ route, navigation }) {
  const { categoryName, products } = route.params;
  const [selectedFilter, setSelectedFilter] = useState("All"); // Default filter

  // You could add filter options based on attributes like size, color, etc.
  const filters = ["All", "Price: Low-High", "Price: High-Low"];

  const filterProducts = (products, filter) => {
    let filteredProducts = [...products];

    switch (filter) {
      case "Price: Low-High":
        return filteredProducts.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
      case "Price: High-Low":
        return filteredProducts.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
      default:
        return filteredProducts;
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={
        item.quantity > 0
          ? () => navigation.navigate("ProductDetail", { product: item })
          : () => alert(`${item.name} will be available soon!`)
      }
      // onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Image
        source={{ uri: item.featured_image }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productMerchant}>{item.merchant.name}</Text>
        <Text style={styles.productPrice}>
          KSh {parseFloat(item.price).toLocaleString()}
        </Text>

        {/* Display available sizes */}
        {item.attributes.some((attr) => attr.attribute_type === "Size") && (
          <View style={styles.attributeContainer}>
            <Text style={styles.attributeTitle}>Sizes: </Text>
            <View style={styles.attributeValues}>
              {item.attributes
                .filter((attr) => attr.attribute_type === "Size")
                .map((attr) => (
                  <Text key={attr.id} style={styles.attributeValue}>
                    {attr.value}
                  </Text>
                ))}
            </View>
          </View>
        )}

        {/* Display available colors */}
        {item.attributes.some((attr) => attr.attribute_type === "Color") && (
          <View style={styles.attributeContainer}>
            <Text style={styles.attributeTitle}>Colors: </Text>
            <View style={styles.attributeValues}>
              {item.attributes
                .filter((attr) => attr.attribute_type === "Color")
                .map((attr) => (
                  <Text key={attr.id} style={styles.attributeValue}>
                    {attr.value}
                  </Text>
                ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter options */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilter,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={filterProducts(products, selectedFilter)}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No products in this category
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    fontSize: 16,
    color: "#0066cc",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedFilter: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  filterText: {
    fontSize: 14,
    color: "#444",
  },
  selectedFilterText: {
    color: "#fff",
  },
  productsList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    minWidth: 160,
    maxWidth: "48%",
  },
  productImage: {
    width: "100%",
    height: 150,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  productMerchant: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0066cc",
  },
  attributeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  attributeTitle: {
    fontSize: 12,
    color: "#666",
  },
  attributeValues: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attributeValue: {
    fontSize: 12,
    marginRight: 5,
    color: "#444",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
  },
});
