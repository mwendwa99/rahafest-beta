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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "react-native-paper";

import { Input, Button, Text } from "../../components";
import { danger, success, warning } from "../../utils/toast";
import { register } from "../../redux/auth/authActions";

const background = require("../../assets/pattern.png");
const logo = require("../../assets/logo.png");

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      danger("PINs do not match", 2000);
      console.log("PINs do not match");
      return;
    }

    const registerData = {
      name: `${firstName} ${lastName}`,
      password: password,
      password2: confirmPassword,
      email: email,
      tc: checked,
    };

    dispatch(register(registerData));
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.pattern}>
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
              color="#483248"
              onPress={handleSignup}
              theme="dark"
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleNavigate("Login")}>
              <Text value={"Login"} variant={"body"} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <StatusBar style="light" />
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
    // height: "100%",
  },
  row: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // width: "100%",
  },
  input: {
    flex: 1,
    margin: 5,
  },
});
