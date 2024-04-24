import axios from "axios";
import { prod } from "../env";

export const GetPointApi = async (token) => {
    try {
        const { data }  = await axios.get(prod.chat + "/points", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        throw error.message;
    }
}