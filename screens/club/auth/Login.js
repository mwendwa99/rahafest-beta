import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../../redux/auth/authActions";
import { Input, Button, Text } from "../../../components";
import { danger, warning } from "../../../utils/toast";

import pattern from "../../../assets/pattern.png";
const logo = require("../../../assets/logo.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      // console.log(error);
      danger("error", 2000);
    }
  }, [error]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogin = () => {
    if (password === "" || email === "") {
      warning("Please fill in all fields");
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    console.log(loginData);

    // dispatch(login(loginData));
  };
  return (
    <ImageBackground
      source={pattern}
      resizeMode="repeat"
      style={styles.container}
    >
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <Input
              theme={true}
              onChange={setEmail}
              inputStyle={{ ...styles.input, width: "100%" }}
              placeholder={"Email"}
              type="email-address"
            />
          </View>
          <View style={styles.row}>
            <Input
              theme={true}
              onChange={(pin) => setPassword(pin)}
              inputStyle={{ ...styles.input, width: "100%" }}
              placeholder={"Password"}
            />
          </View>

          <Button
            label={loading ? `loggin in...` : "Login"}
            onPress={handleLogin}
            variant={"contained"}
          />
          <Button
            label="New here? Login"
            onPress={() => handleNavigate("Register")}
            variant={"text"}
          />
        </View>
      </View>
      <StatusBar barStyle="light-content" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 100,
    objectFit: "contain",
  },
  section: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "rgba(0,0,0, 0.7)",
  },
  row: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
