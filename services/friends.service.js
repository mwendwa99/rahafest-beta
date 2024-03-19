import axios from "axios";
import { prod } from "../env";

export const GetAcceptedFriends = async (token) => {
    try {
        const response = await axios.get(prod.web + "/accepted-friendships",
        {
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

export const GetFriendRequest = async (token) => {
    try {
        const response = await axios.get(prod.web + "/unaccepted-friendship-requests",
        {
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

export const SendFriendRequest = async (token, userInfo) => {
    console.log(userInfo)
    try {
        const response = await axios.get(prod.web + "/request-friendship",
        userInfo,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.message;
    }
};