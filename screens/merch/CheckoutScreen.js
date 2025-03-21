import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import { formatCurrencyWithCommas } from "../../utils/helper";
import { validatePhone } from "../../utils/form_validation";
import api from "../../services/api.service";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useCart();
  const [isLoading, setIsloading] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const normalizedPhone = billingInfo.phone.startsWith("+")
    ? billingInfo.phone
    : `+${billingInfo.phone}`;

  const validateForm = () => {
    const newErrors = {};

    if (!billingInfo.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!billingInfo.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    const phoneValidation = validatePhone(billingInfo.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;

    if (!billingInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderAttributes = (attributes) => {
    if (!attributes || Object.keys(attributes).length === 0) {
      return null;
    }

    return Object.entries(attributes)
      .map(([type, value]) => `${type}: ${value}`)
      .join(", ");
  };

  const formatOrderData = () => {
    console.log(state.items);
    const formattedItems = state.items.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      attr: [item.attributes.id],
    }));

    return {
      items: formattedItems,
      billing_info: {
        ...billingInfo,
        phone: normalizedPhone,
      },
      source_application: 2,
    };
  };

  const handleSubmit = async () => {
    try {
      setIsloading(true);

      if (!validateForm()) {
        Alert.alert("Error", "Please fill in all required fields correctly");
        setIsloading(false);
        return;
      }

      if (state.items.length === 0) {
        Alert.alert("Error", "Your cart is empty");
        setIsloading(false);
        return;
      }

      const orderData = formatOrderData();
      console.log("Submitting order:", JSON.stringify(orderData));

      const response = await api.post("orders/create-order", orderData);

      if (
        response.data &&
        response.data.data &&
        response.data.data.order_number
      ) {
        Alert.alert("Success", "Your order has been placed successfully!", [
          {
            text: "OK",
            onPress: () => {
              dispatch({
                type: "CLEAR_CART",
              });
              // navigation.navigate("Payment");
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Order created but no order number received.");
      }
    } catch (error) {
      let errorMessage = "Failed to place the order. Please try again.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        try {
          const errorPart = error.response.data.message.split(
            "An unexpected error occurred:"
          )[1];
          if (errorPart) {
            const cleanedErrorPart = errorPart.trim();
            const errorObject = JSON.parse(cleanedErrorPart.replace(/'/g, '"'));
            for (const field in errorObject) {
              if (
                Array.isArray(errorObject[field]) &&
                errorObject[field][0]?.string
              ) {
                errorMessage = errorObject[field][0].string;
                break;
              }
            }
          } else {
            errorMessage = error.response.data.message;
          }
        } catch (parseError) {
          console.error("Error parsing error message:", parseError);
          errorMessage = "Wrong phone number format";
        }
      }

      console.error("Order creation failed:", error);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.first_name && styles.inputError]}
            value={billingInfo.first_name}
            onChangeText={(text) =>
              setBillingInfo({ ...billingInfo, first_name: text })
            }
            placeholder="Enter your first name"
            placeholderTextColor={"#888"}
          />
          {errors.first_name && (
            <Text style={styles.errorText}>{errors.first_name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.last_name && styles.inputError]}
            value={billingInfo.last_name}
            onChangeText={(text) =>
              setBillingInfo({ ...billingInfo, last_name: text })
            }
            placeholder="Enter your last name"
            placeholderTextColor={"#888"}
          />
          {errors.last_name && (
            <Text style={styles.errorText}>{errors.last_name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={billingInfo.phone}
            onChangeText={(text) =>
              setBillingInfo({ ...billingInfo, phone: text })
            }
            placeholder="+254xxxxxxxxx"
            keyboardType="phone-pad"
            placeholderTextColor={"#888"}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={billingInfo.email}
            onChangeText={(text) =>
              setBillingInfo({ ...billingInfo, email: text })
            }
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={"#888"}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {state.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.attributes && Object.keys(item.attributes).length > 0 ? (
              <Text style={styles.cartItemVariant}>
                {renderAttributes(item.attributes)}
              </Text>
            ) : (
              // For backward compatibility with existing cart items
              <Text style={styles.cartItemVariant}>
                {item.selectedSize && `Size: ${item.selectedSize}`}
                {item.selectedSize && item.selectedColor && ", "}
                {item.selectedColor && `Color: ${item.selectedColor}`}
              </Text>
            )}
            <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemPrice}>
              Kes.{" "}
              {formatCurrencyWithCommas(parseFloat(item.price) * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>
            Kes. {formatCurrencyWithCommas(state.total)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isLoading ? "Loading..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    color: "#007AFF",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CheckoutScreen;
