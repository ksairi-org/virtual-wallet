import type { HomeStackNavigatorParamList } from "./types";
import { ProfileScreen, HomeScreen, AIScreen } from "@screens";
import { createStackNavigator } from "../createNavigator";
import { useLingui } from "@lingui/react/macro";

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  const { t } = useLingui();
  return (
    <Stack.Navigator initialRouteName={"ProfileScreen"}>
      <Stack.Screen
        name={"ProfileScreen"}
        component={ProfileScreen}
        options={{ headerTitle: t`Profile` }}
      />

      <Stack.Screen
        name={"HomeScreen"}
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"AIScreen"}
        component={AIScreen}
        options={{
          headerTitle: t`AI Assistant`,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack.Navigator>
  );
};

export { HomeStackNavigator };
