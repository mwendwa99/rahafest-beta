import axios from "axios";
import { prod } from "../env";

const headers = {
  "Content-Type": "application/json",
};

export const RegisterApi = async (userData) => {
  try {
    const { data } = await axios.post(
      prod.web + "/register",
      userData,
      headers
    );
    return data;
  } catch (error) {
    throw error.message;
  }
};

export const LoginApi = async (userData) => {
  try {
    const { data } = await axios.post(prod.web + "/login", userData, headers);
    return data;
  } catch (error) {
    throw error.message;
  }
};
