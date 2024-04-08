import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
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
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const { user, authError } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  useEffect(() => {
    if (authError) {
      danger("could not register!", 2000);
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
      email === "" ||
      id === "" ||
      phone === "" ||
      checked === ""
    ) {
      warning("All fields are required!");
      return;
    }

    if(phone.length < 10) {
      warning('Phone number must be 10 digits long', 2000);
      return;
    }


    if (password !== confirmPassword) {
      danger("Passwords do not match", 2000);
      return;
    }

    const registerData = {
      name: `${firstName} ${lastName}`,
      password: password,
      password2: confirmPassword,
      email: email,
      tc: checked,
      phone: phone,
      id: id
    };
    dispatch(register(registerData));
  };

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
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
              defaultValue={"Password"}
              secureTextEntry={isPasswordSecure}
              typePassword={true}
              isPasswordSecure={isPasswordSecure}
              setIsPasswordSecure={setIsPasswordSecure}
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
              defaultValue={"Confirm Password"}
              secureTextEntry={isPasswordSecure}
              typePassword={true}
              isPasswordSecure={isPasswordSecure}
              setIsPasswordSecure={setIsPasswordSecure}
            />
          </View>
          <View style={styles.row}>
            <Input
              theme={true}
              onChange={(id) => setId(id)}
              inputStyle={{ ...styles.input, width: "100%" }}
              defaultValue={" Identity Document"}
              type="numeric"
            />
          </View>
          <View style={styles.row}>
            <Input
              theme={true}
              // onChange={validatePhone()}
              onChange={(phone) => {
                const numericPhone = phone.replace(/[^0-9]/g, '');
                setPhone(numericPhone);
              }}
              inputStyle={{ ...styles.input, width: "100%" }}
              defaultValue={"Phone"}
              type="numeric"
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
                textStyle={{
                  marginLeft: 9
                }}
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
    width: "60%",
  },
  input: {
    flex: 1,
    margin: 5,
  },
});
