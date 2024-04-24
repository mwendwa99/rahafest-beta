import axios from "axios";
import { prod } from "../env";

const headers = {
    "Content-Type": "application/json",
};

export const GetEvents = async (token) => {
    try {
        const { data } = await axios.get(prod.chat + "/events", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        return error.message;
    }
}