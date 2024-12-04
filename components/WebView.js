import React from "react";
import { WebView } from "react-native-webview";

// <form id="payment-form" method="POST" action="https://testsecureacceptance.cybersource.com/pay">
const VisaPaymentWebView = ({ formData }) => {
  console.log({ formData });
  // Create an HTML form that will be auto-submitted
  const htmlForm = `
    <html>
    <body>
        <form id="payment-form" method="POST" action="https://secureacceptance.cybersource.com/pay>
          ${Object.entries(formData)
            .map(
              ([key, value]) =>
                `<input type="hidden" name="${key}" value="${value}">`
            )
            .join("")}
        </form>
        <script>
          // Submit the form automatically when the page loads
          document.getElementById('payment-form').submit();
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlForm }}
      style={{ flex: 1 }}
      startInLoadingState
      // Optional: Handle navigation state changes
      onNavigationStateChange={(navState) => {
        // You can handle navigation changes here
        console.log("Navigation State:", navState);
      }}
    />
  );
};

export default VisaPaymentWebView;
