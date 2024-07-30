import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, TextInput } from "react-native-paper";

import { Input, Button, Text } from "../../../components";
import { danger, success, warning } from "../../../utils/toast";
import { registerUser } from "../../../redux/auth/authActions";

const pattern = require("../../../assets/pattern.png");

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {
    user,
    error: authError,
    loading,
  } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (value) => {
    setFirstName(value);
    setError(value ? "" : "* Field is required");
  };

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

    // phone should be a valid phone number
    if (phone.length < 10) {
      danger("phone number is invalid", 2000);
      console.log("phone number is invalid");
      return;
    }

    // email should be a valid email
    if (!email.includes("@") || !email.includes(".")) {
      danger("email is invalid", 2000);
      console.log("email is invalid");
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
      phone: phone,
      email: email,
      tc: checked,
    };

    // console.log(registerData);

    dispatch(registerUser(registerData));
  };
  return (
    <ImageBackground
      source={pattern}
      resizeMode="repeat"
      style={styles.container}
    >
      <View style={styles.section}>
        <View style={styles.section}>
          <View style={styles.column}>
            <Input
              required
              value={firstName}
              onChange={handleInputChange}
              placeholder={"First Name *"}
              errorMessage={error}
            />
            {error ? <Text style={{ color: "red" }} value={error} /> : null}
          </View>
          <View style={styles.column}>
            <Input
              onChange={setLastName}
              placeholder={"Last Name *"}
              required
            />
            {error ? <Text style={{ color: "red" }} value={error} /> : null}
          </View>
          <View style={styles.column}>
            <Input
              onChange={setEmail}
              placeholder={"Email *"}
              keyboardType="email-address"
              inputMode="email"
              autoComplete="email"
              required
            />
            {error ? <Text style={{ color: "red" }} value={error} /> : null}
          </View>
          <View style={styles.column}>
            <Input
              onChange={setPhone}
              placeholder={"Phone number *"}
              keyboardType="phone"
              inputMode="phone"
              autoComplete="phone"
              required
            />
            {error ? <Text style={{ color: "red" }} value={error} /> : null}
          </View>
          <View style={styles.column}>
            <Input
              onChange={(pin) => setPassword(pin)}
              placeholder={"Password *"}
              required
              keyboardType="default"
              secureTextEntry={showPassword}
              autoComplete="password"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {error ? <Text style={{ color: "red" }} value={error} /> : null}
          </View>
          <View style={styles.column}>
            <Input
              onChange={(pin) => setConfirmPassword(pin)}
              placeholder={"Confirm Password *"}
              required
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
            {error ? <Text style={{ color: "red" }} value={error} /> : null}
          </View>
          {Platform.OS === "android" && (
            <View style={styles.row}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                color="#fff"
                onPress={() => {
                  setChecked(!checked);
                }}
                style={{ color: "#fff" }}
              />
              <Text
                value={"Agree to the terms and conditions"}
                variant={"body"}
                style={{ color: "#fff" }}
              />
            </View>
          )}
          {Platform.OS === "ios" && (
            <Checkbox.Item
              status={checked ? "checked" : "unchecked"}
              color="#fff"
              labelStyle={{ color: "#fff" }}
              label="Agree to the terms and conditions"
              onPress={() => {
                setChecked(!checked);
              }}
            />
          )}
          <Button
            label={loading ? "Registering..." : "Register"}
            onPress={handleSignup}
            variant={"contained"}
          />
          <Button
            label="Already have an account? Login"
            onPress={() => handleNavigate("Login")}
            variant={"text"}
            style={{ color: "#fff" }}
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
