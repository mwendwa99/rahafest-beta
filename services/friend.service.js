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
    console.log("DATA::\t",data);
    const response = await axios.post(prod.chat + "/request-friendship", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const GetFriendRequest = async (token) => {
  try {
    const { data } = await axios.get(prod.chat + "/unaccepted-friendship-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error,message;
  }
}
