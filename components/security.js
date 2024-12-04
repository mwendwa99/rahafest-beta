import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";

// Build the string to sign
const buildDataToSign = (params) => {
  const signedFields = params.signed_field_names.split(",");
  const dataToSign = signedFields.map((field) => `${field}=${params[field]}`);
  return dataToSign.join(",");
};

// Sign the data
const signData = (data, secretKey) => {
  const hash = HmacSHA256(data, secretKey);
  return Base64.stringify(hash);
};

// Generate form data object instead of query string
export const generateHostedCheckoutData = (invoice) => {
  const SECRET_KEY = invoice.secret_key;
  const timestamp = new Date().toISOString().replace(/\.[0-9]{3}/, "");

  const generateUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

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

  return { ...params, signature };
};
