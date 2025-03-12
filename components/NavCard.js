// components/NavCard.js
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NavCard = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={32} color="orange" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 30,
    backgroundColor: "#212529",
    borderRadius: 6,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    color: "orange",
  },
});

export default NavCard;
