import axios from "axios";
import { prod } from "../env";

export const AcceptFriendRequest = async (token, data) => {
  try {
    const response = await axios.post(prod.chat + `/friendships/accept`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const RejectFriendRequest = async (token, data) => {
  try {
    const response = await axios.post(prod.chat + `/friendships/reject`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const SendFriendRequestApi = async (token, data) => {
  try {
    const response = await axios.post(prod.chat + "/request-friendship", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
