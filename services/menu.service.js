import axios from "axios";
import { prod } from "../env";

const headers = {
    "Content-Type": "application/json",
};

export const GetMenu = async () => {
    try {
        console.log("GETTING MENU::\t")
        const { data } = await axios.get(`${prod.chat}/menu-categories`);
        return data;
    } catch (error) {
        throw error;
    }
}