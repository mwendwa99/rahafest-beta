import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import api from "../../services/api.service"; // Assuming this is where your api.get is defined

export default function Marketplace({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/all-products");
      if (response.data && response.data.status === "success") {
        const items = response.data.data.items;
        setProducts(items);

        // Extract unique categories from products
        const uniqueCategories = items.reduce((acc, product) => {
          const categoryExists = acc.find(
            (cat) => cat.id === product.category.id
          );
          if (!categoryExists) {
            acc.push({
              id: product.category.id,
              name: product.category.name,
              // Use the first product's image as category image
              image: product.featured_image,
            });
          }
          return acc;
        }, []);

        setCategories(uniqueCategories);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await fetchProducts();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const navigateToCategory = (category) => {
    // Filter products by the selected category
    const categoryProducts = products.filter(
      (product) => product.category.id === category.id
    );

    // Navigate to category products screen with the filtered products
    navigation.navigate("CategoryProducts", {
      categoryName: category.name,
      products: categoryProducts,
    });

    // navigation.navigate(category.name);
  };

  // Category Card Component
  const CategoryCard = ({ category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigateToCategory(category)}
    >
      <Image
        source={{ uri: category.image }}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <View style={styles.categoryNameContainer}>
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading products...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
      </View> */}

      {/* <Text style={styles.sectionTitle}>Categories</Text> */}

      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryCard category={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.categoriesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0000ff"]}
              tintColor="#0000ff"
              title="Pull to refresh"
              titleColor="#666"
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No categories available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    minHeight: 220,
    justifyContent: "center",
  },
  categoryImage: {
    width: "100%",
    height: 120,
    // maxHeight: 120,
    objectFit: "contain",
  },
  categoryNameContainer: {
    padding: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
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
    marginBottom: 10,
  },
});
