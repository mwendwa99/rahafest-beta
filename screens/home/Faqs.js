import { useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  Text,
} from "react-native";
import { Accordion } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { getFaq } from "../../redux/faq/faqActions";

const splash = require("../../assets/splash.png");

export default function Faqs() {
  const { faq, loading, error } = useSelector((state) => state.faq);
  const dispatch = useDispatch();

  //   console.log({ faq });

  useEffect(() => {
    dispatch(getFaq());
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={splash}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <StatusBar style="light" />
      </ImageBackground>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "black" }}>
          Oops! Something went wrong with the server.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={faq}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Accordion
            question={item.question}
            answer={item.answer}
            index={index}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#212529",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
