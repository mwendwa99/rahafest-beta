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

const { width } = Dimensions.get("window");

const ItemPage = () => {
  const route = useRoute();
  const { item } = route.params;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(item.images[0]);

  const discountedPrice = item.price * (1 - item.discount_rate / 100);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize || !selectedMaterial) {
      alert("Please select all options before adding to cart");
      return;
    }

    const cartItem = {
      ...item,
      selectedColor,
      selectedSize,
      selectedMaterial,
      quantity,
      finalPrice: discountedPrice * quantity,
    };

    // Add to cart logic here
    console.log("Adding to cart:", cartItem);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: selectedImage.url }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.images.map((image) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => setSelectedImage(image)}
            >
              <Image
                source={{ uri: image.url }}
                style={[
                  styles.thumbnail,
                  selectedImage.id === image.id && styles.selectedThumbnail,
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
          <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
          {item.discount_rate > 0 && (
            <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
          )}
        </View>
        <Text style={styles.rating}>
          ★ {item.rating} | {item.merchant}
        </Text>
        {item.is_rahaclub_vip && (
          <View style={styles.vipBadge}>
            <Text style={styles.vipText}>VIP Product</Text>
          </View>
        )}

        {/* Color Selection */}
        <Text style={styles.sectionTitle}>Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.attribute.color.map((color) => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorOption,
                selectedColor?.id === color.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              <Image source={{ uri: color.image }} style={styles.colorImage} />
              <Text style={styles.optionText}>{color.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Size Selection */}
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.optionsRow}>
          {item.attribute.size.map((size) => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.sizeOption,
                selectedSize?.id === size.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={styles.optionText}>{size.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Material Selection */}
        <Text style={styles.sectionTitle}>Material</Text>
        <View style={styles.optionsRow}>
          {item.attribute.material.map((material) => (
            <TouchableOpacity
              key={material.id}
              style={[
                styles.materialOption,
                selectedMaterial?.id === material.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedMaterial(material)}
            >
              <Text style={styles.optionText}>{material.name}</Text>
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
            Add to Cart - ${(discountedPrice * quantity).toFixed(2)}
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
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  mainImage: {
    width: width,
    height: width,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#999",
  },
  rating: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  vipBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  vipText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  colorOption: {
    marginRight: 12,
    alignItems: "center",
  },
  colorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  materialOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  optionText: {
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ItemPage;
