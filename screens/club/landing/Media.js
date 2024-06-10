import { StyleSheet, View} from "react-native";
import ImageList from "../../../components/ImageList";

export default function Media() {
  return (
    <View style={styles.container}>
       <ImageList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
