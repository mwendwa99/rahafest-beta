import { createSlice } from "@reduxjs/toolkit";
import { webSocketService } from "../../services/ws.service";

const friendSlice = createSlice({
  name: "friendship",
  initialState: {
    friends: [],
    pendingRequests: [],
    directMessages: {},
    isConnected: false,
    error: null,
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload
      );
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    },
    addPendingRequest: (state, action) => {
      state.pendingRequests.push(action.payload);
    },
    removePendingRequest: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(
        (request) => request.id !== action.payload
      );
    },
    setDirectMessages: (state, action) => {
      state.directMessages[action.payload.friendId] = action.payload.messages;
    },
    addDirectMessage: (state, action) => {
      if (!state.directMessages[action.payload.friendId]) {
        state.directMessages[action.payload.friendId] = [];
      }
      state.directMessages[action.payload.friendId].push(
        action.payload.message
      );
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFriends,
  addFriend,
  removeFriend,
  setPendingRequests,
  addPendingRequest,
  removePendingRequest,
  setDirectMessages,
  addDirectMessage,
  setConnectionStatus,
  setError,
} = friendSlice.actions;

export const initializeFriendWebSocket = (token) => (dispatch) => {
  const friendshipWS = webSocketService.createConnection(
    "friendship",
    "ws://rahaclub.rahafest.com/ws/friendships/"
  );

  friendshipWS.connect(token);

  friendshipWS.on("connected", () => {
    dispatch(setConnectionStatus(true));
  });

  friendshipWS.on("disconnected", () => {
    dispatch(setConnectionStatus(false));
  });

  friendshipWS.on("message", (data) => {
    switch (data.action) {
      case "accepted-list":
        dispatch(setFriends(data.friends));
        break;
      case "request-friendship":
        dispatch(addFriend(data.friend));
        break;
      case "delete-friendship":
        dispatch(removeFriend(data.friendId));
        break;
      case "unaccepted-list":
        dispatch(setPendingRequests(data.requests));
        break;
      //   case "new-friend-request":
      //     dispatch(addPendingRequest(data.request));
      //     break;
      //   case "friend-request-resolved":
      //     dispatch(removePendingRequest(data.requestId));
      //     break;
      case "dm-list":
        dispatch(
          setDirectMessages({
            friendId: data.friendId,
            messages: data.messages,
          })
        );
        break;
      case "send-dm":
        dispatch(
          addDirectMessage({ friendId: data.friendId, message: data.message })
        );
        break;
      default:
        console.log("Unknown action:", data.action);
    }
  });

  friendshipWS.on("error", (error) => {
    dispatch(setError(error.message));
  });
};

export const getFriends = () => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "accepted-list" });
};

export const sendFriendRequest = (friendId) => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "request-friendship", friendId });
};

export const acceptFriendRequest = (requestId) => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "accept-friend-request", requestId });
};

export const rejectFriendRequest = (requestId) => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "reject-friend-request", requestId });
};

export const removeFriendAction = (friendId) => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "delete-friendship", friendId });
};

export const getDirectMessages = (friendId) => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "dm-list", friendId });
};

export const sendDirectMessage = (friendId, message) => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "send-dm", friendId, message });
};

export const getPendingRequests = () => (dispatch) => {
  const friendshipWS = webSocketService.getConnection("friendship");
  friendshipWS.send({ action: "unaccepted-list" });
};

export default friendSlice.reducer;
