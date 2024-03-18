import { View, StyleSheet, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Text, ListItem } from "../../components";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../redux/auth/authActions";
import { success } from "../../utils/toast";

export default function Settings({ navigation }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // dispatch(logout());
    success("Logout success");
    navigation.navigate("Home");
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ListItem
          title="Faqs"
          iconLeft={"help-circle"}
          iconRight={"chevron-right"}
          handlePressLink={() => handleNavigate("Faqs")}
        />

        <ListItem
          title="Logout"
          iconLeft={"logout"}
          iconRight={"chevron-right"}
          handlePressLink={handleLogout}
        />
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#212529",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
