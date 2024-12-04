import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../useWebSocket";

export const useFriendships = () => {
  const [pendingFriendships, setPendingFriendships] = useState([]);
  const [users, setUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isConnected, sendMessage, connectionError } = useWebSocket({
    url: "wss://rahaclub.rahafest.com/ws/friendships",
    tokenKey: "token",
    initialMessage: { action: "unique-users" },
    onMessage: (data) => {
      // console.log("onMessage received:", data);
      handleWebSocketMessage(data);
    },
    onError: (err) => {
      console.error("WebSocket error:", err);
      setError(typeof err === "string" ? err : "An error occurred");
      setIsLoading(false);
    },
  });

  // Centralized handler for WebSocket messages
  const handleWebSocketMessage = (data) => {
    // console.log("WebSocket message received:", data);

    if ("status" in data && data.status === "error") {
      setError(data.message);
      setIsLoading(false);
      return;
    }

    switch (data.action) {
      case "unique-users":
        // console.log("Setting users:", data.users);
        setUsers(data.users || []);
        setError(null);
        break;

      case "unaccepted-list":
        // console.log("Setting pendingFriendships:", data.friendships);
        setPendingFriendships(data.friendships || []);
        setError(null);
        break;

      case "accepted-list":
        setUserFriends(data.friendships || []);
        setError(null);
        break;

      case "request-friendship":
        if (data.status === "error") {
          //   console.log("Request friendship error:", data.message);
          setError(data.message);
        } else {
          //   console.log("Updating pendingFriendships:", data.friendships);
          setPendingFriendships(data.friendships || []);
          setError(null);
        }
        break;

      case "accept-friendship":
        // console.log("Updating pendingFriendships (accept):", data.friendships);
        setPendingFriendships(data.friendships || []);
        setError(null);
        break;

      default:
        console.warn(`Unhandled action: ${data.action}`);
    }

    setIsLoading(false);
  };

  // Send friend request
  const sendFriendRequest = useCallback(
    (friendId) => {
      setIsLoading(true);
      setError(null);
      sendMessage({
        action: "request-friendship",
        friend_id: friendId,
      });
    },
    [sendMessage]
  );

  // Accept friend request
  const acceptFriendRequest = useCallback(
    (friendshipId) => {
      setIsLoading(true);
      setError(null);
      sendMessage({
        action: "accept-friendship",
        friendship_id: friendshipId,
      });
    },
    [sendMessage]
  );

  // Fetch pending requests
  const fetchPendingRequests = useCallback(() => {
    setIsLoading(true);
    setError(null);
    sendMessage({ action: "unaccepted-list" });
  }, [sendMessage]);

  // Fetch user userFriends
  const fetchUserFriends = useCallback(() => {
    console.log("Fetching userFriends...");
    setIsLoading(true);
    setError(null);

    try {
      sendMessage({ action: "accepted-list" });
    } catch (err) {
      console.error("Failed to fetch userFriends:", err);
      setError("Unable to fetch user friends.");
      setIsLoading(false);
    }
  }, [sendMessage]);

  // Get friendship status
  const getFriendshipStatus = useCallback(
    (userId) => {
      const pendingRequest = pendingFriendships.find(
        (friendship) =>
          friendship.sender_id === userId || friendship.recipient_id === userId
      );

      if (!pendingRequest) {
        return { status: "NOT_FRIENDS", friendshipId: null };
      }

      if (pendingRequest.is_accepted) {
        return { status: "FRIENDS", friendshipId: pendingRequest.id };
      }

      if (pendingRequest.is_declined) {
        return { status: "DECLINED", friendshipId: pendingRequest.id };
      }

      const isPendingReceived = pendingRequest.recipient_id === userId;
      return {
        status: isPendingReceived ? "PENDING_RECEIVED" : "PENDING_SENT",
        friendshipId: pendingRequest.id,
      };
    },
    [pendingFriendships]
  );

  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
    }
  }, [connectionError]);

  return {
    pendingFriendships,
    users,
    isLoading,
    error,
    isConnected,
    sendFriendRequest,
    acceptFriendRequest,
    fetchPendingRequests,
    getFriendshipStatus,
    fetchUserFriends,
    userFriends,
  };
};
