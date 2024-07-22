import React, { useState } from "react";
import { List } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { Dimensions, StyleSheet } from "react-native";

export default function Accordion({ question, answer, index }) {
  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);
  const { width } = Dimensions.get("window");

  return (
    <List.Accordion
      title={question || "empty"}
      left={(props) => (
        <List.Icon {...props} icon="frequently-asked-questions" />
      )}
      expanded={expanded}
      onPress={handlePress}
      titleNumberOfLines={50}
    >
      <List.Item
        descriptionNumberOfLines={50}
        description={() => (
          <RenderHtml
            contentWidth={width}
            source={{ html: answer || "<p>empty</p>" }}
            tagsStyles={styles.html}
          />
        )}
      />
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  html: {
    p: {
      marginVertical: 0,
    },
  },
});
