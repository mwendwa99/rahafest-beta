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

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useCart();

  const [billingInfo, setBillingInfo] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!billingInfo.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!billingInfo.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    // Remove symbols and non-numeric characters
    const sanitizedPhone = billingInfo.phone.replace(/[^0-9]/g, "");

    if (!sanitizedPhone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^254\d{9}$/.test(sanitizedPhone)) {
      newErrors.phone =
        "Please enter a valid Kenyan phone number (254xxxxxxxxx)";
    }

    if (!billingInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatOrderData = () => {
    const formattedItems = state.items.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      // attr: [item.selectedSize.id, item.selectedColor.id],
      attr: [item.selectedSizeId, item.selectedColorId],
    }));

    return {
      items: formattedItems,
      billing_info: billingInfo,
    };
  };

  // console.log(JSON.stringify(state.items));

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields correctly");
      return;
    }

    if (state.items.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    const orderData = formatOrderData();

    Alert.alert("Thank you!", "You will be able to pre-order soon!", [
      {
        text: "OK",
        onPress: () => {
          dispatch({ type: "CLEAR_CART" });
          navigation.navigate("Merchandise");
        },
      },
    ]);

    // console.log(JSON.stringify(orderData));

    // Here you would typically make an API call to submit the order
    // For now, we'll just show a success message
    // Alert.alert(
    //   "Order Submitted",
    //   "Your order has been received successfully!",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         dispatch({ type: "CLEAR_CART" });
    //         navigation.navigate("MerchandisePage");
    //       },
    //     },
    //   ]
    // );
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
            placeholder="254xxxxxxxxx"
            keyboardType="phone-pad"
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
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {state.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Size: {item.selectedSize} | Color: {item.selectedColor}
            </Text>
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
        <Text style={styles.submitButtonText}>Place Order</Text>
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
