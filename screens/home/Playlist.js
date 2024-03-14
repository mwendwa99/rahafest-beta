import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { VideoPlayer, Text } from "../../components";

const videoIds = [
  {
    id: 1,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
  {
    id: 2,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
  {
    id: 3,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
  {
    id: 4,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
  {
    id: 5,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
  {
    id: 6,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
];

export default function Playlist() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videoIds}
        renderItem={({ item }) => (
          <View>
            <Text value={item.artist} color="#fafafa" variant="body" />
            <VideoPlayer video={item.videoId} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#212529",
  },
});
