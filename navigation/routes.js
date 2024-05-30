import { useSelector } from "react-redux";

import AppNav from "./AppNav";
import HomeNavigator from "../screens/home";
import EventNavigator from "../screens/events";
import ClubNavigator from "../screens/club";

export default function Routes() {
  const { token, message } = useSelector((state) => state.auth);

  const isAuthenticated = () => {
    if (token && message === "Login Success") {
      return true;
    } else {
      return false;
    }
  };

  const appRoutes = [
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
      component: ClubNavigator,
      icon_focused: "cards-club",
      icon_default: "cards-club-outline",
    },
  ];

  return <AppNav routes={appRoutes} />;
}
