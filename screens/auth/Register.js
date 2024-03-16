import { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Input, Button, Text } from "../../components";
import { danger, warning } from "../../utils/toast";

const background = require("../../assets/pattern.png");
const logo = require("../../assets/logo.png");

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      danger("PINs do not match", 2000);
      console.log("PINs do not match");
      return;
    }

    const registerData = {
      first_name: firstName,
      last_name: lastName,
      password: password,
      password_confirm: confirmPassword,
      email: email,
    };

    console.log(registerData);
    // navigation.navigate("Login");
  };
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.section}>
          <Text value={"create account"} variant={"subtitle"} />
          <View style={styles.row}>
            <Input
              theme={true}
              onChange={setFirstName}
              inputStyle={{ ...styles.input, width: "100%" }}
              defaultValue={"First Name"}
            />
            <Input
              theme={true}
              onChange={setLastName}
              inputStyle={{ ...styles.input, width: "100%" }}
              defaultValue={"Last Name"}
            />
          </View>
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
          <View style={styles.row}>
            <Input
              theme={true}
              onChange={(pin) => setConfirmPassword(pin)}
              inputStyle={{
                ...styles.input,
                width: "100%",
              }}
              defaultValue={"confirm password"}
            />
          </View>

          <Button label="Register" onPress={handleSignup} theme="dark" />
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
