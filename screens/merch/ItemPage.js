// ItemPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import { formatCurrencyWithCommas } from "../../utils/helper";
import { success } from "../../utils/toast";

const { width } = Dimensions.get("window");

const ItemPage = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const { dispatch } = useCart(); // Add this line to get cart dispatch

  const [selectedColor, setSelectedColor] = useState({
    id: 0,
    value: "",
  });
  const [selectedSize, setSelectedSize] = useState({
    id: 0,
    value: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(item.featured_image);

  // Filter attributes by type
  const sizes = item.attributes.filter(
    (attr) => attr.attribute_type === "Size"
  );
  const colors = item.attributes.filter(
    (attr) => attr.attribute_type === "Color"
  );

  const handleAddToCart = () => {
    if (selectedColor.value == "" || selectedSize.value === "") {
      alert("Please select all options before adding to cart");
      return;
    }

    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      featured_image: item.featured_image,
      selectedColor: selectedColor.value,
      selectedColorId: selectedColor.id,
      selectedSize: selectedSize.value,
      selectedSizeId: selectedSize.id,
      quantity: quantity,
    };

    // Dispatch to cart context instead of console.log
    dispatch({
      type: "ADD_TO_CART",
      payload: cartItem,
    });

    success(`${item.name} added to cart!`);

    navigation.goBack();

    // alert("Item added to cart successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: selectedImage }}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[item.featured_image, ...item.images].map((image, index) => (
            <TouchableOpacity
              key={image.id || index} // Fallback to index if `id` is undefined
              onPress={() => setSelectedImage(image.image || image)}
            >
              <Image
                source={{ uri: image.image || image }}
                style={[
                  styles.thumbnail,
                  selectedImage === (image.image || image) &&
                    styles.selectedThumbnail,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            Kes. {formatCurrencyWithCommas(parseInt(item.price))}
          </Text>
        </View>

        {item.is_rahaclub_vip && (
          <View style={styles.vipBadge}>
            <Text style={styles.vipText}>VIP Product</Text>
          </View>
        )}

        {/* Color Selection */}
        <Text style={styles.sectionTitle}>Color*</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorOption,
                selectedColor?.id === color.id && styles.selectedOption,
              ]}
              onPress={() =>
                setSelectedColor({
                  id: color.id,
                  value: color.value,
                })
              }
            >
              {/* <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color.value.toLowerCase() },
                ]}
              /> */}
              <Text style={styles.optionText}>{color.value}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Size Selection */}
        <Text style={styles.sectionTitle}>Size*</Text>
        <View style={styles.optionsRow}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.sizeOption,
                selectedSize?.id === size.id && styles.selectedOption,
              ]}
              onPress={() =>
                setSelectedSize({
                  id: size.id,
                  value: size.value,
                })
              }
            >
              <Text style={styles.optionText}>{size.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quantity Selection */}
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
              quantity < item.quantity && setQuantity(quantity + 1)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>
            Add to Cart - Kes.{" "}
            {formatCurrencyWithCommas(parseInt(item.price) * quantity)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageGallery: {
    padding: 10,
  },
  mainImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
  },
  vipBadge: {
    backgroundColor: "#FFD700",
    padding: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  vipText: {
    color: "#000",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  colorOption: {
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
    padding: 10,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sizeOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 44,
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
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
  addToCartButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ItemPage;
