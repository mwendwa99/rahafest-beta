//@ts-nocheck
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import Header from "@/components/Header";

const headerStyles = {
  headerStyle: {
    backgroundColor: "#000",
  },
  headerShadowVisible: false,
  headerTitleStyle: {
    color: "#fafafa",
  },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        ...headerStyles,

        headerTitleAlign: "center",
        tabBarActiveTintColor: "#ffd33d",
        tabBarStyle: {
          backgroundColor: "#212529",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",

          headerTitle: (props) => <Header {...props} title="events" />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="merchandise"
        options={{
          title: "Merchandise",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="club"
        options={{
          headerShown: false,
          title: "Club",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "star-half" : "star-half-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
