import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Dashboard from "./Dashboard";

const Stack = createNativeStackNavigator();

const ChatNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Friends"
                component={Dashboard}
                options={{headerShown: false}}
            />
           <Stack.Screen
                name="Feeds"
                component={Dashboard}
                options={{headerShown: false}}
            />
           {/* <Stack.Screen
                name="Chats"
                component={Chat}
                options={{headerShown: false}}
            /> */}
        </Stack.Navigator>
    )
}

export default ChatNavigator;