import axios from "axios";
import { prod } from "../env";

const headers = {
  "Content-Type": "application/json",
};

export const GetFaqApi = async () => {
  try {
    const { data } = await axios.get(`${prod.web}/faqs`);
    return data;
  } catch (error) {
    throw error;
  }
};
