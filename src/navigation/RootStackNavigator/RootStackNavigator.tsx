import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackNavigatorParamList } from "./types";
import { HomeStackNavigator } from "../HomeStackNavigator";
import {
  SignUpScreen,
  LoginScreen,
  ResetPasswordScreen,
  WelcomeScreen,
} from "@screens";
import { createStackNavigator } from "../createNavigator";
import { styled } from "tamagui";
import { ForgotPasswordScreen } from "src/screens/ForgotPasswordScreen";
import { useAuthenticationStatus } from "@react-auth-core";
import { useUserStore } from "@stores";

const Stack = createStackNavigator<RootStackNavigatorParamList>();

const StyledSafeAreaView = styled(SafeAreaView, {
  flex: 1,
});

const RootStackNavigator = () => {
  const status = useAuthenticationStatus();
  const isLoggedIn = status === "logged in";
  const hasSeenWelcomeScreen = useUserStore(
    (state) => state.hasSeenWelcomeScreen,
  );

  return (
    <SafeAreaProvider>
      <StyledSafeAreaView>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Group
              screenOptions={{
                headerShown: false,
              }}
            >
              {!hasSeenWelcomeScreen ? (
                <Stack.Screen
                  name={"WelcomeScreen"}
                  component={WelcomeScreen}
                />
              ) : null}
              <Stack.Screen
                name={"HomeStackNavigator"}
                component={HomeStackNavigator}
              />
            </Stack.Group>
          ) : (
            <Stack.Group
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name={"LoginScreen"} component={LoginScreen} />

              <Stack.Screen name={"SignUpScreen"} component={SignUpScreen} />

              <Stack.Screen
                name={"ForgotPasswordScreen"}
                component={ForgotPasswordScreen}
              />
              <Stack.Screen
                name={"ResetPasswordScreen"}
                component={ResetPasswordScreen}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </StyledSafeAreaView>
    </SafeAreaProvider>
  );
};

export { RootStackNavigator };
