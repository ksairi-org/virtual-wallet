import type { HomeStackNavigatorParamList } from "./types";
import { AccountScreen, HomeScreen } from "@screens";
import { createStackNavigator } from "../createNavigator";

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName={"AccountScreen"}>
    <Stack.Screen
      name={"AccountScreen"}
      component={AccountScreen}
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
