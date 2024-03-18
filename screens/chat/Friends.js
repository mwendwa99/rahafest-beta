import { FlatList, SafeAreaView, Text, View } from "react-native";
import FriendRequest from "./components/FriendRequest";
import AcceptedFriend from "./components/AcceptedFriend";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
// const scrollViewRef = useRef(null);

export default function Friends() {
    const [isAccepted, setIsAccepted] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const dispatch = useDispatch();
    
    const scrollToBottom = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: false });
        }
    };

    const acceptRequest = async (friendRequestId) => {
    
    };

    const Unfriend = async (friend) => {
    
    };

    return (
        <SafeAreaView>
            <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 && <Text>Your Friend Requests!</Text>}
            {friendRequests.length === 0 && (
            <Text style={{ textAlign: "center", marginHorizontal: 20 }}>
                You have no Friend Requests!
            </Text>
            )}
            {friendRequests.map((item, index) => (
            <FriendRequest
                key={index}
                item={item}
                friendRequests={friendRequests}
                Unfriend={Unfriend}
                setFriendRequests={setFriendRequests}
                acceptRequest={acceptRequest}
                isAccepted={isAccepted}
            />
            ))}
            </View>
            {friends.length === 0 && (
                <Text style={{ textAlign: "center", marginHorizontal: 20 }}>You have no Friends!</Text>
            )}
            {friends.length > 0 && (
                <Text style={{ fontSize: 20, fontWeight: 500, marginLeft: 15 }}>Recent friends</Text>
            )}
            <FlatList
                // ref={scrollViewRef}
                data={friends}
                renderItem={({ item, index }) => (
                <AcceptedFriend index={index} item={item} isLoading={isLoading} Unfriend={Unfriend} />
                )}
                keyExtractor={(item, index) => index.toString()}
                style={{ padding: 15 }}
            />
        </SafeAreaView>
    );
};
