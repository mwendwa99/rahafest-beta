import { useSelector } from "react-redux";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Button } from "../../../components";
import { Image, View, Text } from "react-native";

import visaLogo from "../../assets/visa.png";
import masterLogo from "../../assets/mastercard.png";
import { SecureCheckout } from "../../components/SecureCheckout";
import { Button } from "../../components";

// In your screen/component:
export default function PayWithCard({ navigation }) {
  const { order } = useSelector((state) => state.merch);
  const [showCheckout, setShowCheckout] = useState(false);

  console.log(JSON.stringify(order));

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {showCheckout ? (
        <SecureCheckout
          invoice={order}
          // onClose={() => setShowCheckout(false)}
          onClose={() => navigation.goBack()} // or however you want to handle closing
        />
      ) : (
        // Your other payment options UI
        <View style={{ alignItems: "center", padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={visaLogo}
              style={{ height: 100, width: 100 }}
              resizeMode="contain"
            />
            <Text style={{ fontWeight: 700, fontSize: 20, margin: 20 }}>
              OR
            </Text>
            <Image
              source={masterLogo}
              style={{ height: 100, width: 100 }}
              resizeMode="contain"
            />
          </View>

          <Button
            label="Proceed"
            variant="contained"
            onPress={() => setShowCheckout(true)}
          />
        </View>
      )}
    </View>
  );
}
