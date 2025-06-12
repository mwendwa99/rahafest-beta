import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";

import { UserList } from "../../../../components";
import { useWebSocket } from "../../../../hooks";
import { useSelector } from "react-redux";
import { success } from "../../../../utils/toast";

export default function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // Separate state for search
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Memoize displayed users - either search results or filtered all users
  const displayedUsers = useMemo(() => {
    // If we have a search query and search results, show search results
    if (searchQuery.trim() && searchResults.length > 0) {
      return searchResults;
    }
    
    // If we have a search query but no search results from API, filter locally
    if (searchQuery.trim() && Array.isArray(allUsers)) {
      const query = searchQuery.toLowerCase();
      return allUsers.filter(user => {
        const userSlug = (user?.friend_user_slug || user?.user_slug || '').toLowerCase();
        return userSlug.includes(query);
      });
    }
    
    // Default: show all users (ensure it's always an array)
    return Array.isArray(allUsers) ? allUsers : [];
  }, [allUsers, searchResults, searchQuery]);

  const handleResponse = useCallback((data) => {
    switch (data.action) {
      case "unique-users":
        // Ensure users is always an array
        const cleanUsers = Array.isArray(data.users) 
          ? data.users.map(user => ({
              ...user,
              id: user.id || Math.random().toString(),
            }))
          : [];
        setAllUsers(cleanUsers);
        setIsLoading(false);
        break;
      case "error":
        console.log("Error from friends server:", data);
        setAllUsers([]); // Set to empty array on error
        setIsLoading(false);
        setIsSearching(false);
        break;
      case "request-friendship":
        console.log("request friendship response", data);
        success(data.message);
        break;
      default:
        console.log("Websocket response action", data.action);
        break;
    }
  }, []);

  const friendsWs = useWebSocket(
    `wss://rahaclub.rahafest.com/ws/friendships/?token=${token}`,
    handleResponse
  );

  // API search function
  const searchUsers = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults([]); // Clear search results
        return;
      }

      setIsSearching(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
          `https://rahaclub.rahafest.com/api/search-user?search=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          // Ensure search results is always an array
          const results = Array.isArray(data.users) ? data.users : 
                         Array.isArray(data) ? data : [];
          
          setSearchResults(results.map(user => ({
            ...user,
            id: user.id || Math.random().toString(),
          })));
        } else {
          console.error("Search failed:", response.status);
          setSearchResults([]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Search error:", error);
        }
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [token]
  );

  // Clear search results when search query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const handleSendFriendRequest = useCallback(
    (friendId) => {
      if (friendsWs?.connected) {
        try {
          friendsWs.send({
            action: "request-friendship",
            friend_id: friendId,
          });
          console.log(`Friend request sent to user ID: ${friendId}`);
        } catch (error) {
          console.error("Failed to send friend request:", error);
        }
      } else {
        console.error("WebSocket is not connected.");
      }
    },
    [friendsWs]
  );

  useEffect(() => {
    if (friendsWs?.connected) {
      console.log("WebSocket connected, sending unique-users request");
      friendsWs.send({ action: "unique-users" });
    }

    return () => {
      if (friendsWs?.connected) {
        friendsWs.close();
        console.log("All Users WebSocket disconnected.");
      }
    };
  }, [friendsWs?.connected]);

  const renderUserItem = useCallback(({ item: user }) => (
    <UserList
      key={user.id}
      user={user}
      handleSendFriendRequest={() => handleSendFriendRequest(user.id)}
    />
  ), [handleSendFriendRequest]);

  const keyExtractor = useCallback((item) => 
    item.id?.toString() || Math.random().toString(), []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Search Users</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isSearching && (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
            style={styles.searchLoader}
          />
        )}
      </View>

      <FlatList
        data={displayedUsers}
        renderItem={renderUserItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 70,
          offset: 70 * index,
          index,
        })}
        ListEmptyComponent={
          <Text style={styles.noUsersText}>
            {isSearching 
              ? "Searching..." 
              : searchQuery 
                ? "No users found" 
                : "No users"
            }
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
    margin: 0,
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#2A2A2A",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  searchLoader: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
  },
  noUsersText: {
    color: "#fafafa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});