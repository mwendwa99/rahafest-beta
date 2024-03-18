import { useState } from "react";
import { List } from "react-native-paper";

export default function Accordion({ question, answer, index }) {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  

  return (
    <List.Accordion
      title={question || "empty"}
      left={(props) => (
        <List.Icon {...props} icon="frequently-asked-questions" />
      )}
      expanded={expanded}
      onPress={handlePress}
    >
      <List.Item descriptionNumberOfLines={50} description={answer || "empty"} />
    </List.Accordion>
  );
}
