import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackNavigatorParamList } from "./types";
import { HomeStackNavigator } from "../HomeStackNavigator";
import { SignUpScreen, LoginScreen } from "@screens";
import { createStackNavigator } from "../createNavigator";
import { styled } from "tamagui";
import { WelcomeScreen } from "src/screens/WelcomeScreen";

const Stack = createStackNavigator<RootStackNavigatorParamList>();

const StyledSafeAreaView = styled(SafeAreaView, {
  flex: 1,
});

const RootStackNavigator = () => {
  const isLoggedIn = false;
  return (
    <SafeAreaProvider>
      <StyledSafeAreaView>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "HomeStackNavigator" : "LoginScreen"}
        >
          <Stack.Screen
            name={"HomeStackNavigator"}
            component={HomeStackNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={"LoginScreen"}
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name={"SignUpScreen"}
            component={SignUpScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name={"WelcomeScreen"}
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </StyledSafeAreaView>
    </SafeAreaProvider>
  );
};

export { RootStackNavigator };
