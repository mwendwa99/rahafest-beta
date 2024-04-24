import axios from "axios";
import { prod } from "../env";

const headers = {
    "Content-Type": "application/json",
};

export const GetTickets = async (token) => {
    try {
        const { data } = await axios.get(prod.chat + "/tickets", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log("T::/t", data)
        const tickets = [
            {
              "ticket_id": 1,
              "event_name": "Music Concert",
              "venue": "City Stadium",
              "date": "2024-05-10",
              "time": "19:00",
              "ticket_type": "General Admission",
              "price": 25,
              "available_seats": 500
            },
            {
              "ticket_id": 2,
              "event_name": "Tech Conference",
              "venue": "Convention Center",
              "date": "2024-06-15",
              "time": "09:00",
              "ticket_type": "Standard Pass",
              "price": 100,
              "available_seats": 300
            },
            {
              "ticket_id": 3,
              "event_name": "Food Festival",
              "venue": "Downtown Square",
              "date": "2024-07-20",
              "time": "12:00",
              "ticket_type": "VIP Pass",
              "price": 50,
              "available_seats": 100
            },
            {
              "ticket_id": 4,
              "event_name": "Art Exhibition",
              "venue": "Gallery Hall",
              "date": "2024-08-05",
              "time": "10:00",
              "ticket_type": "Standard Ticket",
              "price": 20,
              "available_seats": 200
            },
            {
              "ticket_id": 5,
              "event_name": "Sports Match",
              "venue": "National Stadium",
              "date": "2024-09-10",
              "time": "15:00",
              "ticket_type": "Premium Seat",
              "price": 50,
              "available_seats": 1000
            },
            {
              "ticket_id": 6,
              "event_name": "Comedy Show",
              "venue": "Laugh Factory",
              "date": "2024-10-20",
              "time": "20:00",
              "ticket_type": "General Admission",
              "price": 30,
              "available_seats": 400
            },
            {
              "ticket_id": 7,
              "event_name": "Movie Premiere",
              "venue": "Cinema Plaza",
              "date": "2024-11-15",
              "time": "18:30",
              "ticket_type": "VIP Ticket",
              "price": 40,
              "available_seats": 150
            },
            {
              "ticket_id": 8,
              "event_name": "Science Fair",
              "venue": "Science Center",
              "date": "2024-12-05",
              "time": "09:00",
              "ticket_type": "Student Pass",
              "price": 10,
              "available_seats": 500
            },
            {
              "ticket_id": 9,
              "event_name": "Fashion Show",
              "venue": "Fashion Mall",
              "date": "2025-01-15",
              "time": "14:00",
              "ticket_type": "Front Row",
              "price": 75,
              "available_seats": 50
            },
            {
              "ticket_id": 10,
              "event_name": "Gaming Tournament",
              "venue": "Gaming Arena",
              "date": "2025-02-20",
              "time": "11:00",
              "ticket_type": "Competitor Pass",
              "price": 50,
              "available_seats": 200
            }
          ]
          return tickets
        // return data;
    } catch (error) {
        return error.message;
    }
}