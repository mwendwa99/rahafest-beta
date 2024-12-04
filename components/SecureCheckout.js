import React, { useRef, useState, useEffect } from "react";
import { View, ActivityIndicator, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";

const buildDataToSign = (params) => {
  const signedFields = params.signed_field_names.split(",");
  const dataToSign = signedFields.map((field) => `${field}=${params[field]}`);
  return dataToSign.join(",");
};

const signData = (data, secretKey) => {
  const hash = HmacSHA256(data, secretKey);
  return Base64.stringify(hash);
};

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const SecureCheckout = ({ invoice, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const webViewRef = useRef(null);

  useEffect(() => {
    const SECRET_KEY = invoice.secret_key;
    const timestamp = new Date().toISOString().replace(/\.[0-9]{3}/, "");

    const params = {
      access_key: invoice.access_key,
      profile_id: invoice.profile_id,
      transaction_uuid: generateUUID(),
      signed_date_time: timestamp,
      locale: "en",
      transaction_type: "sale",
      amount: (invoice.total_amount || 0).toString(),
      currency: invoice.currency,
      reference_number: invoice.invoice_number,
      unsigned_field_names: "",
      signed_field_names:
        "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency",
    };

    const dataToSign = buildDataToSign(params);
    const signature = signData(dataToSign, SECRET_KEY);

    const formFields = Object.entries({ ...params, signature })
      .map(
        ([key, value]) => `<input type="hidden" name="${key}" value="${value}">`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        </head>
        <body>
          <form id="paymentForm" method="POST" action="https://secureacceptance.cybersource.com/pay">
            ${formFields}
          </form>
          <script>
            document.getElementById('paymentForm').submit();
          </script>
        </body>
      </html>
    `;

    setHtmlContent(html);
    setLoading(false);
  }, [invoice]);

  const handleNavigationStateChange = (navState) => {
    console.log("Navigation state changed:", navState.url);
    if (navState.url.includes("success")) {
      onClose();
    } else if (navState.url.includes("cancel")) {
      onClose();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onNavigationStateChange={handleNavigationStateChange}
          scalesPageToFit={true}
          mixedContentMode="always"
          allowsBackForwardNavigationGestures={true}
          allowUniversalAccessFromFileURLs={true}
          onError={(syntheticEvent) => {
            console.warn("WebView error:", syntheticEvent.nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            console.warn("WebView HTTP error:", syntheticEvent.nativeEvent);
          }}
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
