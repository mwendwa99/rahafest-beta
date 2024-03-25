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
    const response = await axios.get(prod.chat + `/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
export const GetDirectMessage = async (token, messageId) => {
  try {
    // const { data } = await axios.get(prod.chat + `/directmessages`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    const data =  [
      {
        "id": 1,
        "content": "HI John ,Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
        "timestamp": "2024-03-13T15:09:22.775008+03:00",
        "pic": null,
        "sender": 2,
        "recipient": 1
      },
      {
        "id": 3,
        "content": "lhkmnhdgffhjv, xol",
        "timestamp": "2024-03-13T18:00:01.957549+03:00",
        "pic": null,
        "sender": 1,
        "recipient": 2
      },
      {
        "id": 4,
        "content": "sadrtdfyguhijo[",
        "timestamp": "2024-03-13T18:01:01.685509+03:00",
        "pic": null,
        "sender": 2,
        "recipient": 1
      },
      {
        "id": 5,
        "content": "qdfghsc ;sidvn[svnfdv",
        "timestamp": "2024-03-14T15:09:48.339491+03:00",
        "pic": "http://127.0.0.1:7005/media_files/DMs/CNNrVRIBu91-png__700_img_627a51f1a0ffe.jpg",
        "sender": 1,
        "recipient": 2
      }
    ];
    // return response.data;
    return data;
  } catch (error) {
    throw error.message;
  }
};

export const GetUsersApi = async (token) => {
  try {
    const { data } = await axios.get(prod.chat + "/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error.message;
  }
};
