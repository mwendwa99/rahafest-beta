import axios from "axios";
import { prod } from "../env";

export const GetNewsApi = async () => {
  try {
    const { data } = await axios.get(`${prod.web}/media`);
    return data;
  } catch (error) {
    return error;
  }
};
