import axios from "axios"
import { prod } from "../env"

export const GetTransactionsApi = async (token) => {
    try {
        const { data } = axios.get(prod + "transactions", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return data;
    } catch (error) {
        return error;
    }

    // Simulate delay
    // const trans = [
    //     {
    //         id: 1,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 2,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 3,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 4,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 5,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 6,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 7,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     },
    //     {
    //         id: 8,
    //         amount: "20",
    //         recipient: "Sijui",
    //         recipientImg: "Sijui",
    //         timeStamp: "2:32am"
    //     }
    // ];
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    return trans;
};