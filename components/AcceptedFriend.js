import { Pressable, Image, Text, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const AcceptedFriend = ({ index, item, isLoading, Unfriend }) => {
  const goToChat = () => {
    alert("Chat with " + item.name);
    // console.log(item);
  };

  return (
    <Pressable key={index} style={styles.mainPressable} onPress={goToChat}>
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "wheat",
        }}
        source={{ uri: item.image }}
      />

      <Text style={{ fontSize: 15, marginLeft: 10, flex: 1 }}>
        {item?.name}
      </Text>

      <Pressable
        onPress={() => Unfriend(item)}
        style={styles.unfriendPressable}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="white"
            style={{ marginRight: 10 }}
          />
        ) : (
          <Text style={{ textAlign: "center", color: "white" }}>Unfriend</Text>
        )}
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    borderBottomWidth: 0.34,
    borderBottomColor: "gray",
    paddingBottom: 10,
  },
  unfriendPressable: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 6,
  },
});

export default AcceptedFriend;
