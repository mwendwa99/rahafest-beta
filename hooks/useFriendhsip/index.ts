import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../useWebSocket";

export const useFriendships = () => {
  const [pendingFriendships, setPendingFriendships] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isConnected, sendMessage, connectionError } = useWebSocket({
    url: "wss://rahaclub.rahafest.com/ws/friendships",
    tokenKey: "token",
    initialMessage: { action: "unique-users" },
    onMessage: (data) => handleWebSocketMessage(data),
    onError: (err) => {
      setError(typeof err === "string" ? err : "An error occurred");
      setIsLoading(false);
    },
  });

  // Centralized handler for WebSocket messages
  const handleWebSocketMessage = (data) => {
    if ("status" in data && data.status === "error") {
      setError(data.message);
      setIsLoading(false);
      return;
    }

    switch (data.action) {
      case "unique-users":
        setUsers(data.users || []);
        setError(null);
        break;

      case "unaccepted-list":
        setPendingFriendships(data.friendships || []);
        setError(null);
        break;

      case "request-friendship":
        if (data.status === "error") {
          setError(data.message);
        } else {
          setPendingFriendships(data.friendships || []);
          setError(null);
        }
        break;

      case "accept-friendship":
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
  };
};

// export const useFriendships = () => {
//   const [pendingFriendships, setPendingFriendships] = useState([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const { isConnected, sendMessage, connectionError } = useWebSocket({
//     url: "wss://rahaclub.rahafest.com/ws/friendships",
//     tokenKey: "token",
//     initialMessage: {
//       //   action: "unaccepted-list",
//       action: "unique-users",
//     },
//     onMessage: (data) => {
//       if ("status" in data && data.status === "error") {
//         setError(data.message);
//         setIsLoading(false);
//         return;
//       }

//       if (data.action === "unaccepted-list") {
//         setPendingFriendships(data.friendships);
//         setError(null);
//       }
//        if (data.action === "unique-users") {
//          setUsers(data.users);
//          setError(null);
//        }
//       setIsLoading(false);
//     },
//     onError: (err) => {
//       setError(typeof err === "string" ? err : "An error occurred");
//       setIsLoading(false);
//     },
//   });

//   // Send friend request
//   const sendFriendRequest = useCallback(
//     (friendId: number) => {
//       setIsLoading(true);
//       setError(null);
//       sendMessage({
//         action: "request-friendship",
//         friend_id: friendId,
//       });
//     },
//     [sendMessage]
//   );

//   // Accept friend request
//   const acceptFriendRequest = useCallback(
//     (friendshipId: number) => {
//       setIsLoading(true);
//       setError(null);
//       sendMessage({
//         action: "accept-friendship",
//         friendship_id: friendshipId,
//       });
//     },
//     [sendMessage]
//   );

//   // Fetch pending requests
//   const fetchPendingRequests = useCallback(() => {
//     setIsLoading(true);
//     setError(null);
//     sendMessage({
//       action: "unaccepted-list",
//     });
//   }, [sendMessage]);

//   // Helper function to check friendship status
//   const getFriendshipStatus = useCallback(
//     (userId: number) => {
//       const pendingRequest = pendingFriendships.find(
//         (friendship) =>
//           friendship.sender_id === userId || friendship.recipient_id === userId
//       );

//       if (!pendingRequest) {
//         return { status: "NOT_FRIENDS", friendshipId: null };
//       }

//       if (pendingRequest.is_accepted) {
//         return { status: "FRIENDS", friendshipId: pendingRequest.id };
//       }

//       if (pendingRequest.is_declined) {
//         return { status: "DECLINED", friendshipId: pendingRequest.id };
//       }

//       const isPendingReceived = pendingRequest.recipient_id === userId;
//       return {
//         status: isPendingReceived ? "PENDING_RECEIVED" : "PENDING_SENT",
//         friendshipId: pendingRequest.id,
//       };
//     },
//     [pendingFriendships]
//   );

//   useEffect(() => {
//     if (connectionError) {
//       setError(connectionError);
//     }
//   }, [connectionError]);

//   return {
//     pendingFriendships,
//     isLoading,
//     error,
//     isConnected,
//     sendFriendRequest,
//     acceptFriendRequest,
//     fetchPendingRequests,
//     getFriendshipStatus,
//   };
// };
