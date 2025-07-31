import type { HomeStackNavigatorParamList } from "./types";
import { HomeScreen } from "@screens";
import { createStackNavigator } from "../createNavigator";

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName={"HomeScreen"}>
    <Stack.Screen
      name={"HomeScreen"}
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export { HomeStackNavigator };
