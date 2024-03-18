import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { VideoPlayer, Text } from "../../components";

const videoIds = [
  {
    id: 1,
    videoId: "SbgKpHi-Cao",
    artist: "Davido",
  },
  {
    id: 2,
    videoId: "NPCC02SaJVg",
    artist: "King Promise",
  },
  {
    id: 4,
    videoId: "yuGwHO-DPOs",
    artist: "Musa Keys",
  },
  {
    id: 3,
    videoId: "XVkkuTwaXgY",
    artist: "Ya Levis",
  },
  {
    id: 10,
    videoId: "L1nYNjZX3K4",
    artist: "Jb Mpiana",
  },
  {
    id: 5,
    videoId: "dU30FLgld50",
    artist: "Otile Brown",
  },
  {
    id: 6,
    videoId: "7cV9DpE7yy8",
    artist: "Bensoul",
  },
  {
    id: 7,
    videoId: "xHN_G3jdbdA",
    artist: "Nviiri the Storyteller",
  },
  {
    id: 8,
    videoId: "6Ea-3ooL9Ps",
    artist: "Femi One",
  },
  {
    id: 9,
    videoId: "IMw9Q8TM37E",
    artist: "H_art the band",
  },
];

export default function Playlist() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videoIds}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text value={item.artist} color="#fafafa" variant="subtitle" />
            <VideoPlayer video={item.videoId} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <StatusBar style="light" />
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
