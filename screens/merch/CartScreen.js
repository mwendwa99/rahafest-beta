import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { formatCurrencyWithCommas } from "../../utils/helper";

// CartScreen.js
export default function CartScreen({ navigation }) {
  const { state, dispatch } = useCart();

  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { ...item, quantity: newQuantity },
    });
  };

  const removeItem = (item) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: item,
    });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.featured_image }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemVariant}>
          Size: {item.selectedSize}, Color: {item.selectedColor}
        </Text>
        <Text style={styles.cartItemPrice}>
          Kes.{" "}
          {formatCurrencyWithCommas(parseFloat(item.price) * item.quantity)}
        </Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => updateQuantity(item, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeItem(item)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {state.items.length > 0 ? (
        <>
          <FlatList
            data={state.items}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
          />
          <View style={styles.cartSummary}>
            <Text style={styles.totalText}>
              Total: Kes. {formatCurrencyWithCommas(state.total)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate("Merchandise")}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar barStyle={"dark-content"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cartItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  cartItemVariant: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: "auto",
    padding: 8,
    backgroundColor: "#ff4444",
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#fff",
  },
  cartSummary: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: "#fff",
    fontSize: 16,
  },
});
