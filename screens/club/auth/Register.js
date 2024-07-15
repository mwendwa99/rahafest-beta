import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Icon, TextInput } from "react-native-paper";

import { Input, Button, Text } from "../../../components";
import { danger, success, warning } from "../../../utils/toast";
import { register } from "../../../redux/auth/authActions";

const pattern = require("../../../assets/pattern.png");
const logo = require("../../../assets/logo.png");

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { user, authError } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  // console.log({ user });
  // console.log({ authError });

  useEffect(() => {
    if (authError) {
      danger("could not register!", 2000);
      // console.log(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (user && !authError) {
      success("You have successfully registered!", 2000);
      navigation.navigate("Login");
    }
  }, [user]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const handleSignup = () => {
    if (
      firstName === "" ||
      lastName === "" ||
      password === "" ||
      confirmPassword === "" ||
      email === ""
    ) {
      warning("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      danger("passwords do not match", 2000);
      console.log("passwords do not match");
      return;
    }

    const registerData = {
      first_name: firstName,
      last_name: lastName,
      password: password,
      password_confirm: confirmPassword,
      email: email,
      tc: checked,
    };

    console.log(registerData);

    // dispatch(register(registerData));
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
            <Input onChange={setFirstName} placeholder={"First Name"} />
            <Input onChange={setLastName} placeholder={"Last Name"} />
          </View>
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
              secureTextEntry={true}
              autoComplete="password"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          </View>
          <View style={styles.row}>
            <Input
              onChange={(pin) => setConfirmPassword(pin)}
              placeholder={"Confirm Password"}
              keyboardType="default"
              autoComplete="password"
              secureTextEntry={showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          </View>
          {Platform.OS === "android" && (
            <View style={styles.row}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                color="#fff"
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <Text
                value={"Agree to the terms and conditions"}
                variant={"body"}
                color="#fff"
              />
            </View>
          )}
          {Platform.OS === "ios" && (
            <Checkbox.Item
              status={checked ? "checked" : "unchecked"}
              color="#fff"
              label="Agree to the terms and conditions"
              onPress={() => {
                setChecked(!checked);
              }}
            />
          )}
          <Button
            label="Register"
            onPress={handleSignup}
            variant={"contained"}
          />
          <Button
            label="Already have an account? Login"
            onPress={() => handleNavigate("Login")}
            variant={"text"}
          />
        </View>
      </View>
      <StatusBar style="light" />
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
