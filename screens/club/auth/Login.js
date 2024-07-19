import { useState, useEffect } from "react";
import { StyleSheet, View, Image, StatusBar, Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../../../redux/auth/authActions";
import { clearError } from "../../../redux/auth/authSlice";
import { Input, Button } from "../../../components";
import { danger, warning } from "../../../utils/toast";

import pattern from "../../../assets/pattern.png";
import { TextInput } from "react-native-paper";
const logo = require("../../../assets/logo.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, user, token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
      danger(error["message"], 2000);
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

    // console.log(loginData);

    dispatch(loginUser(loginData));
  };

  // console.log({ user, error, token });

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
              onChange={setEmail}
              placeholder={"Email"}
              keyboardType="email-address"
              inputMode="email"
              autoComplete="email"
            />
          </View>
          <View style={styles.row}>
            <Input
              onChange={(pin) => setPassword(pin)}
              placeholder={"Password"}
              keyboardType="default"
              autoComplete="password"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                  size={24}
                />
              }
            />
          </View>

          <Button
            label={loading ? `logging in...` : "Login"}
            onPress={handleLogin}
            variant={"contained"}
          />
          <Button
            label="New here? Register"
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
