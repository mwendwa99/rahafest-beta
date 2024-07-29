import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Dropdown({
  title = "",
  showAccordion,
  setShowAccordion,
  children,
}) {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        imageStyle={{ objectFit: "cover" }}
        borderRadius={10}
        style={styles.accordionOuter}
        source={require("../assets/pattern-single.png")}
      >
        <TouchableOpacity
          style={styles.accordionInner}
          onPress={() => setShowAccordion(!showAccordion)}
        >
          <Text value={title} variant="subtitle" style={{ color: "#fff" }} />
          <MaterialCommunityIcons
            name={showAccordion ? "chevron-up" : "chevron-down"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </ImageBackground>
      {showAccordion && <View style={{ flex: 1 }}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionOuter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  accordionInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 1)",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
});
