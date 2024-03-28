import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/auth/authActions";
import { Input, Button, Text } from "../../components";
import { danger, warning } from "../../utils/toast";
import { TextInput } from "react-native-paper";

const background = require("../../assets/pattern.png");
const logo = require("../../assets/logo.png");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authError, loading } = useSelector((state) => state.auth);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authError) {
      console.log(authError);
      danger("Error at login!", 2000);
    }
  }, [authError]);

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
              secureTextEntry={isPasswordSecure}
              typePassword={true}
              isPasswordSecure={isPasswordSecure}
              setIsPasswordSecure={setIsPasswordSecure}
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
      <StatusBar barStyle="light-content" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
