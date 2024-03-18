import { StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { prod } from "../env";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

export default function NewsItem({ active, title, description, image }) {
  return (
    active && (
      <Card style={styles.card} mode="elevated">
        <Card.Cover
          source={{ uri: `${prod.image}${image}` }}
          style={styles.image}
        />
        <Card.Content>
          <Text variant="titleLarge">{title}</Text>
          <Text variant="bodyMedium">{description}</Text>
        </Card.Content>
      </Card>
    )
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    backgroundColor:"#fafafa"
  },
  image: {
    height: 200,
    objectFit: "contain",
    margin: 10,
  },
});
