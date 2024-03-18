import axios from "axios";
import { prod } from "../env";

export const GetAcceptedFriends = async (token) => {
    try {
        const response = axios.get(prod.web + "/accepted-friendships",
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