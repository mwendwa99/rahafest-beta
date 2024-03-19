import axios from "axios";
import { prod } from "../env";

const headers = {
  "Content-Type": "application/json",
};

export const RegisterApi = async (userData) => {
  try {
    const { data } = await axios.post(
      prod.chat + "/register",
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
    const { data } = await axios.post(prod.chat + "/login", userData, headers);
    return data;
  } catch (error) {
    throw error.message;
  }
};

export const GetUserApi = async (token) => {
  try {
    const response = await axios.get(prod.chat + "/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
