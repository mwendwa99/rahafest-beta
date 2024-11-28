import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchProps {
  placeholder: string;
  searchInput: string;
  setSearchInput: (input: string) => void;
}

export default function Search({
  placeholder = "search",
  searchInput,
  setSearchInput,
}: SearchProps) {
  const handleSearchChange = (input: string) => {
    setSearchInput(input);
  };

  const clearSearch = () => setSearchInput("");

  return (
    <View style={styles.container}>
      <Ionicons name={"search"} color={"#000"} size={24} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={handleSearchChange}
        value={searchInput}
      />
      <Ionicons
        name={"close"}
        color={"#262626"}
        size={20}
        style={styles.icon}
        onPress={clearSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    maxWidth: 380,
    borderRadius: 22,
    height: 44,
    margin: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
  },
});
