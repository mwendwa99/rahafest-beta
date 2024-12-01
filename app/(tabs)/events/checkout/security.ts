//@ts-nocheck
import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";

// Build the string to sign
const buildDataToSign = (params: Record<string, string>): string => {
  const signedFields = params.signed_field_names.split(",");
  const dataToSign = signedFields.map((field) => `${field}=${params[field]}`);
  return dataToSign.join(",");
};

// Sign the data
const signData = (data: string, secretKey: string): string => {
  const hash = HmacSHA256(data, secretKey);
  return Base64.stringify(hash); // Convert to Base64
};

export const handleVisaProceed = async (
  invoice: Record<string, string | number>
) => {
  const SECRET_KEY = invoice.secret_key;
  const timestamp = new Date().toISOString().replace(/\.[0-9]{3}/, "");

  // Generate a unique transaction UUID
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const params = {
    access_key: invoice.access_key as string,
    profile_id: invoice.profile_id as string,
    transaction_uuid: generateUUID(), // Generate new UUID for each transaction
    signed_date_time: timestamp,
    locale: "en",
    transaction_type: "sale",
    amount: (invoice.total_amount || 0).toString(),
    currency: invoice.currency as string,
    reference_number: invoice.invoice_number as string,
    unsigned_field_names: "",
    signed_field_names:
      "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency",
  };

  const dataToSign = buildDataToSign(params);
  const signature = signData(dataToSign, SECRET_KEY);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://testsecureacceptance.cybersource.com/pay";

  const allParams = { ...params, signature };
  Object.entries(allParams).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value as string;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
