import React from "react";
import { WebView } from "react-native-webview";

interface VisaPaymentWebViewProps {
  formData: Record<string, string>; // Changed from string to object
}

const VisaPaymentWebView: React.FC<VisaPaymentWebViewProps> = ({
  formData,
}) => {
  // Create an HTML form that will be auto-submitted
  const htmlForm = `
    <html>
      <body>
        <form id="payment-form" method="POST" action="https://testsecureacceptance.cybersource.com/pay">
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
