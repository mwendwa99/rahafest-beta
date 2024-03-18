import axios from "axios";
import { prod } from "../env";

export const GetUsersApi = async (token) => {
    try {
        const { data } = await axios.get(prod.web + "/all-users");
        return data;
    } catch (error) {
        throw error.message;
    }
}