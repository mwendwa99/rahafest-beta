import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { validateMpesaPhone } from "../../utils/form_validation";
import { triggerSTK } from "../../redux/merch/merchActions";
import { useCart } from "../../context/CartContext";

const PaymentScreen = ({ navigation }) => {
  const { order, mpesa_response, error, loading } = useSelector(
    (state) => state.merch
  );
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useCart();

  const appDispatch = useDispatch();

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const handlePayment = () => {
    setIsLoading(true);
    if (!selectedPayment) return;

    // Validate phone number if M-PESA is selected
    if (selectedPayment === "mpesa") {
      const { isValid, formattedNumber, message } = validateMpesaPhone(phone);

      if (!isValid) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: message,
        }));
        setIsLoading(false);
        return;
      }

      const mpesaData = {
        order_number: order?.order_number,
        phone_number: formattedNumber,
      };

      // Dispatch action and handle success
      appDispatch(triggerSTK(mpesaData))
        .then(() => {
          // Clear cart and navigate
          dispatch({
            type: "CLEAR_CART",
          }); // Replace with your clear cart action
          navigation.navigate("Merchandise"); // Ensure `navigation` is defined
        })
        .catch((error) => {
          console.error("Payment failed:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  console.log(JSON.stringify(error));
  console.log(JSON.stringify(mpesa_response));

  const renderProductItem = (product) => (
    <View key={product.product_id} style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.productPrice}>
          KES {product.product_price.toLocaleString()}
        </Text>
      </View>
      <Text style={styles.quantity}>Quantity: {product.quantity}</Text>
      {product.attributes.map((attr, index) => (
        <Text key={index} style={styles.attribute}>
          {attr.attribute_type}: {attr.value}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.orderNumber}>
            Order No: {order?.order_number}
          </Text>
          <View style={styles.customerInfo}>
            <Text>{order?.customer_name}</Text>
            <Text>{order?.customer_email}</Text>
            <Text>{order?.phone_number}</Text>
          </View>
        </View>

        {/* Products List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          {order?.products.map(renderProductItem)}
        </View>

        {/* Total Amount */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>
            KES {parseFloat(order?.total_amount).toLocaleString()}
          </Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {selectedPayment === "mpesa" && (
            <>
              <Text style={styles.infoText}>
                Please enter your M-PESA number *
              </Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                onChangeText={(text) => setPhone(text)}
                placeholder="254xxxxxxxxx"
                keyboardType="phone-pad"
                placeholderTextColor={"#000"}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "mpesa" && styles.selectedPayment,
            ]}
            onPress={() => handlePaymentSelection("mpesa")}
          >
            <Text style={styles.paymentText}>Pay with M-PESA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "card" && styles.selectedPayment,
            ]}
            onPress={() => handlePaymentSelection("card")}
          >
            <Text style={styles.paymentText}>Pay with Card</Text>
          </TouchableOpacity>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[
            styles.payButton,
            !selectedPayment && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedPayment}
        >
          <Text style={styles.payButtonText}>
            {loading
              ? "Loading..."
              : `Pay KES ${parseFloat(order?.total_amount).toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
  },
  orderNumber: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  customerInfo: {
    gap: 4,
  },
  infoText: {
    fontWeight: 600,
    color: "red",
    marginBottom: 5,
  },
  productCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  quantity: {
    color: "#666",
    marginBottom: 4,
  },
  attribute: {
    color: "#666",
    fontSize: 14,
  },
  totalSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  selectedPayment: {
    borderColor: "#2196F3",
    backgroundColor: "#E3F2FD",
  },
  paymentText: {
    fontSize: 16,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  payButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  payButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PaymentScreen;
