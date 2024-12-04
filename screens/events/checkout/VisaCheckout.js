import { useSelector } from "react-redux";
import { SecureCheckout } from "../../../components/SecureCheckout";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components";
import { Image, View } from "react-native";

import visaLogo from "../../../assets/visa.png";

// In your screen/component:
export default function VisaCheckout() {
  const { invoice } = useSelector((state) => state.events);
  const [showCheckout, setShowCheckout] = useState(false);

  // console.log({ invoice });

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {showCheckout ? (
        <SecureCheckout
          invoice={invoice}
          // onClose={() => setShowCheckout(false)}
          onClose={() => navigation.goBack()} // or however you want to handle closing
        />
      ) : (
        // Your other payment options UI
        <View style={{ alignItems: "center", padding: 20 }}>
          <Image
            source={visaLogo}
            style={{ height: 200, width: 200 }}
            resizeMode="contain"
          />

          <Button
            label="Proceed"
            variant="contained"
            onPress={() => setShowCheckout(true)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
