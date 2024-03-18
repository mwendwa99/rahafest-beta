import { useState, useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/auth/authActions";
import { Input, Button, Text } from "../../components";
import { danger, warning } from "../../utils/toast";

const background = require("../../assets/pattern.png");
const logo = require("../../assets/logo.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, authError, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  console.log({ token });

  useEffect(() => {
    if (authError) {
      danger("could not login!", 2000);
    }
  }, [authError]);

  // useEffect(() => {
  //   if (user && !authError) {
  //     navigation.navigate("Home");
  //   }
  // }, [user]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogin = () => {
    if (password === "" || email === "") {
      warning("All fields are required!");
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    dispatch(login(loginData));
  };
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <KeyboardAwareScrollView style={styles.container}>
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

          <Button label="Login" onPress={handleLogin} theme="dark" />
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleNavigate("Register")}>
            <Text value={"Don't have an account?"} variant={"body"} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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
    // height: "100%",
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