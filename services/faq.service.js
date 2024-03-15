import axios from "axios";
import { prod } from "../env";

const headers = {
  "Content-Type": "application/json",
};

export const GetFaqApi = async () => {
  try {
    // const { data } = await axios.get(prod.URL + "/api/faq", { headers });
    const { data } = await axios.get("https://api.rahafest.com/api/faqs", {
      headers,
    });
    return data;
  } catch (error) {
    return error;
  }
};
