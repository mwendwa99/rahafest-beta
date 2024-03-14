import React from "react";
import { View } from "react-native";
import { Text } from "./Text";
import YoutubePlayer from "react-native-youtube-iframe";

export default VideoPlayer = ({ video }) => {
  return (
    <View>
      <YoutubePlayer height={300} play={false} videoId={video} />
    </View>
  );
};
