import React from "react";
import { View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default VideoPlayer = ({ video }) => {
  return <YoutubePlayer height={200} play={false} videoId={video} />;
};
