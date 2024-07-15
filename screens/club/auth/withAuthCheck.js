import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const withAuthCheck = (WrappedComponent) => {
  return (props) => {
    const user = useSelector((state) => state.auth.user);
    const navigation = useNavigation();

    useEffect(() => {
      if (!user) {
        navigation.navigate("AuthNav");
      }
    }, [user, navigation]);

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuthCheck;
