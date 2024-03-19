import { View, StyleSheet, Image, ScrollView, StatusBar } from "react-native";
import { ListItem } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { success } from "../../utils/toast";
import { persistor } from "../../redux/store";
import { logout } from "../../redux/auth/authActions";

export default function Settings({ navigation }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    persistor.purge();
    dispatch(logout());
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
          title="Maps"
          iconLeft={"google-maps"}
          iconRight={"chevron-right"}
          handlePressLink={() => handleNavigate("Map")}
        />

        {token && (
          <ListItem
            title="Logout"
            iconLeft={"logout"}
            iconRight={"chevron-right"}
            handlePressLink={handleLogout}
          />
        )}
      </ScrollView>
      <StatusBar barStyle="light-content" />
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
