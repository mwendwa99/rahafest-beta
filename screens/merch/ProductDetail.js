import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

export default function ProductDetail({ route, navigation }) {
  const { product } = route.params;
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Group attributes by attribute_type
  const attributeTypes = {};
  product.attributes.forEach((attr) => {
    if (!attributeTypes[attr.attribute_type]) {
      attributeTypes[attr.attribute_type] = [];
    }
    attributeTypes[attr.attribute_type].push(attr.value);
  });

  // State to track selected attributes (using an object to handle multiple attribute types)
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleSelectAttribute = (type, value) => {
    setSelectedAttributes({
      ...selectedAttributes,
      [type]: value,
      //also add id to the selected attributes
      [`id`]: product.attributes.find(
        (attr) => attr.attribute_type === type && attr.value === value
      ).id,
    });
  };

  const handleAddToCart = () => {
    // Check if all attribute types have a selection
    const allAttributesSelected = Object.keys(attributeTypes).every(
      (type) => selectedAttributes[type]
    );

    if (!allAttributesSelected) {
      alert("Please select all product options before adding to cart");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      featured_image: product.featured_image,
      attributes: selectedAttributes,
      quantity: quantity,
    };

    dispatch({ type: "ADD_TO_CART", payload: cartItem });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.featured_image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.merchantName}>
            Sold by: {product.merchant.name}
          </Text>
          <Text style={styles.price}>
            KSh {parseFloat(product.price).toLocaleString()}
          </Text>

          {/* Dynamic Attribute Sections */}
          {Object.keys(attributeTypes).map((attrType) => (
            <View key={attrType} style={styles.attributeSection}>
              <Text style={styles.attributeTitle}>{attrType}</Text>
              <View style={styles.attributeOptions}>
                {attributeTypes[attrType].map((value) => (
                  <TouchableOpacity
                    key={`${attrType}-${value}`}
                    style={[
                      styles.attributeOption,
                      selectedAttributes[attrType] === value &&
                        styles.selectedAttribute,
                    ]}
                    onPress={() => handleSelectAttribute(attrType, value)}
                  >
                    <Text
                      style={[
                        styles.attributeText,
                        selectedAttributes[attrType] === value &&
                          styles.selectedAttributeText,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                quantity < product.quantity && setQuantity(quantity + 1)
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <View style={styles.additionalImages}>
              <Text style={styles.sectionTitle}>More Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {product.images.map((img) => (
                  <Image
                    key={img.id}
                    source={{ uri: img.image }}
                    style={styles.thumbnailImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Merchant Info */}
          <View style={styles.merchantInfo}>
            <Text style={styles.sectionTitle}>Merchant Information</Text>
            <Text style={styles.merchantDetail}>{product.merchant.name}</Text>
            <Text style={styles.merchantDetail}>
              Contact: {product.merchant.phone_number}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Buy Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleAddToCart}>
          <Text style={styles.buyNowText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    fontSize: 16,
    color: "#0066cc",
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  merchantName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: 15,
  },
  attributeSection: {
    marginBottom: 15,
  },
  attributeTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  attributeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attributeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    marginBottom: 10,
  },
  selectedAttribute: {
    backgroundColor: "#0066cc",
  },
  attributeText: {
    fontSize: 14,
    color: "#444",
  },
  selectedAttributeText: {
    color: "#fff",
  },
  stockInfo: {
    marginVertical: 15,
  },
  stockText: {
    fontSize: 14,
    color: "#444",
  },
  additionalImages: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  merchantInfo: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  merchantDetail: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  bottomActions: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    color: "#007AFF",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 16,
  },
});
