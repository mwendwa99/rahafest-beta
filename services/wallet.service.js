import axios from "axios";
import { prod } from "../env";

export const GetWalletApi = async (token) => {
    try {
        const { data } = await axios.get(prod + "/wallet", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        throw error.message;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
    return { wallet: "200" };
}