import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {  Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Avatar } from "../../components";
import DirectMessage from "./DirectMessage";
import Feed from "./Feed";
import Friends from "./Friends";
import AllUsers from "./AllUsers";
import Messages from "./Messages";
import { Register, Login } from "../auth";
import AllFriends from "./AllFriends";
import Dashboard from "./Dashboard";
import Event from "./Event";
import Wallet from "./Wallet";
import Tickets from "./Tickets";
import Transaction from "./Transaction";
import Ticket from "./Ticket";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({navigation}){
  const { user } = useSelector((state) => state.auth);
  const drawerItems = [
    { label: "Dashboard", screen: "Dashboard", iconName: "dashboard" },
    { label: "Feed", screen: "Feed", iconName: "feed" },
    { label: "Messages", screen: "Messages", iconName: "message" },
    // { label: "Direct Message", screen: "DirectMessage", iconName: "mail" },
    { label: "Friends", screen: "Friends", iconName: "verified" },
    { label: "All Users", screen: "AllUsers", iconName: "supervised-user-circle" },
    // { label: "Events", screen: "Events", iconName: "event" },
    { label: "Tickets", screen: "Tickets", iconName: "event" },
    { label: "Wallet", screen: "Wallet", iconName: "wallet" }
  ];

  return (
    <DrawerContentScrollView>
      <View style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        flex: 1
      }}>
        <Avatar size={140}/>
        <Text>{user?.name}</Text>
        <Text>{user?.email}</Text>
      </View>
      {drawerItems.map((item, index) => (
        <DrawerItem
          key={index}
          label={item.label}
          icon={({ color, size }) => (
            <MaterialIcons name={item.iconName} size={size} color={color} />
          )}
          onPress={() => navigation.navigate(item.screen)}
        />
      ))}
    </DrawerContentScrollView>
  );
};

export default function ChatNavigator() {
  const { token } = useSelector((state) => state.auth);

  return token ? (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Messages" component={Messages} />
      <Drawer.Screen name="DirectMessage" component={DirectMessage} />
      <Drawer.Screen name="Friends" component={Friends} />
      <Drawer.Screen name="AllUsers" component={AllUsers} />
      <Drawer.Screen name="Event" component={Event} />
      <Drawer.Screen name="Tickets" component={Tickets} />
      <Drawer.Screen name="Ticket" component={Ticket} />
      <Drawer.Screen name="Wallet" component={Wallet} />
      <Drawer.Screen name="Transaction" component={Transaction} />
    </Drawer.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
