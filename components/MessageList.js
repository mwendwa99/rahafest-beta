import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { formatDate } from "../utils/helper";
import Text from "./Text";
import Button from "./Button";

export default function MessageList({ message, handleNavigate }) {
  // console.log(message);
  return (
    <TouchableOpacity
      onPress={() =>
        handleNavigate("DirectMessage", {
          _id: message?.recipient,
          name: message?.recipient_name,
        })
      }
      style={styles.container}
    >
      <View style={styles.row}>
        <Avatar.Text
          style={{ marginRight: 10 }}
          size={30}
          label={message?.recipient_name[0]}
        />
        <View style={styles.column}>
          <Text value={message?.recipient_name} color="#000" variant="body" />
          <Text value={message?.content} color="#000" variant="small" />
        </View>
      </View>
      <Text
        value={formatDate(message?.timestamp)}
        color="#000"
        variant="small"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
});
