import type { HomeStackNavigatorParamList } from "./types";
import { ProfileScreen, HomeScreen } from "@screens";
import { createStackNavigator } from "../createNavigator";

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName={"ProfileScreen"}>
    <Stack.Screen
      name={"ProfileScreen"}
      component={ProfileScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name={"HomeScreen"}
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export { HomeStackNavigator };
