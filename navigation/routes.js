import AppNav from "./AppNav";
import HomeNavigator from "../screens/home";
import EventNavigator from "../screens/events";
import ChatNavigator from "../screens/chat";
import { useSelector } from "react-redux";
import AuthNavigator from "./AuthNav";

export default function Routes() {
  const { token, message } = useSelector((state) => state.auth);

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
      key: "HomeNav",
      name: "Home",
      component: HomeNavigator,
      icon_focused: "home",
      icon_default: "home-outline",
    },
    {
      key: "EventNav",
      name: "Events",
      component: EventNavigator,
      icon_focused: "calendar-multiple-check",
      icon_default: "calendar-multiple",
    },
    {
      key: "Club",
      name: "Raha Club",
      component: ChatNavigator,
      icon_focused: "cards-club",
      icon_default: "cards-club-outline",
    },
  ];

  return isAuthenticated ? <AppNav routes={routes} /> : <AuthNavigator />;
}
