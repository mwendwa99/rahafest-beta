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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/auth/authActions";
import { Input, Button, Text } from "../../components";
import { danger, warning } from "../../utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

import pattern from "../../assets/pattern.png";
// const pattern = require("../../assets/pattern.png");
const logo = require("../../assets/logo.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      console.log(error);
      danger(error, 2000);
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

    dispatch(login(loginData));
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={pattern}
        resizeMode="repeat"
        style={styles.pattern}
      >
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.section}>
            <Text value={"Login"} variant={"subtitle"} />

            <View style={styles.row}>
              <Input
                theme={true}
                onChange={setEmail}
                inputStyle={{ ...styles.input, width: "100%" }}
                defaultValue={"Email"}
                type="email-address"
              />
            </View>
            <View style={styles.row}>
              <Input
                theme={true}
                onChange={(pin) => setPassword(pin)}
                inputStyle={{ ...styles.input, width: "100%" }}
                defaultValue={"password"}
              />
            </View>

            <Button
              label={loading ? `loggin in...` : "Login"}
              onPress={handleLogin}
              theme="dark"
              color="#483248"
            />
          </View>
          <View style={{ ...styles.row, marginTop: 10 }}>
            <TouchableOpacity onPress={() => handleNavigate("Register")}>
              <Text value={"Signup"} variant={"body"} />
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar barStyle="light-content" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pattern: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
    // margin: 20,
  },
  row: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    margin: 5,
  },
});
