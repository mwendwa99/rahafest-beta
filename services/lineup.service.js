import axios from "axios";
import { prod } from "../env";

export const GetLineupApi = async () => {
  try {
    const { data } = await axios.get(`${prod.web}/lineup`);
    return data;
  } catch (error) {
    return error;
  }
};
