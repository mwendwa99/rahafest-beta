import { warning } from "../../../../utils/toast";

export const declineFriendRequest = (ws, friendId) => {
  if (ws.connected) {
    ws.send({
      action: "decline-friendship",
      friend_id: friendId,
    });
  } else {
    console.log("Disconnected: cannot decline friend request");
  }
};

export const acceptFriendship = (ws, friendId) => {
  if (ws.connected) {
    ws.send({
      action: "accept-friendship",
      friend_id: friendId,
    });
  } else {
    console.log("Disconnected: cannot send friend request");
  }
};

export const handleSendFriendRequest = (ws, friendId) => {
  if (ws.connected) {
    ws.send({
      action: "request-friendship",
      friend_id: friendId,
    });
  } else {
    warning("You are disconnected!", 2000);
    alert("You are disconnected!");
    console.log("Disconnected: Could not send friend request!");
  }
};
