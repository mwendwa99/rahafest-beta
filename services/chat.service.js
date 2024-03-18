import axios from "axios";
import { prod } from "../env";

const headers = {
  "Content-Type": "application/json",
};

export const GetAllMessages = async (token) => {
  try {
    const response = await axios.get(prod.chat + "/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const PostMessageApi = async (token, message) => {
  try {
    const { data } = await axios.post(prod.chat + "/messages", message, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error.message;
  }
};

export const GetDirectMessages = async (token, messageId) => {
  try {
    const response = await axios.get(prod.chat + `/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const PostMessage = async (msg, token) => {
  console.log(msg)
  try {
    const response = await axios.post(prod.web + "/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }, msg);
  } catch (error) {
    throw error.message;
  }
};

export const FetchUserMessages = async (access_token, itemId) => {
  try {
    const { data } = await axios.get(`${prod.web}/messages/${itemId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return data;
  } catch (e) {
    throw handleError(e);
  }
};
