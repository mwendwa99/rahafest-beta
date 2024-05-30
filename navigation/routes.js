// import { AuthNavigator, AppNavigator } from "./navigation";
import AppNav from "./AppNav";
import { Home } from "../screens/home";
import { Chat } from "../screens/chat";
import { useSelector } from "react-redux";

export default function Routes() {
  const { user, token, authError, message } = useSelector(
    (state) => state.auth
  );

  // console.log("user", user);
  // console.log("token", token);
  // console.log("authError", authError);

  const isAuthenticated = () => {
    if (token && message === "Login Success") {
      return true;
    } else {
      return false;
    }
  };

  const routes = [
    {
      name: "Home",
      component: Home,
    },
    {
      name: "Chat",
      component: Chat,
    },
  ];

  return isAuthenticated ? <AppNav routes={routes} /> : <AuthNavigator />;
}
