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

const Stack = createStackNavigator<RootStackNavigatorParamList>();

const StyledSafeAreaView = styled(SafeAreaView, {
  flex: 1,
});

const RootStackNavigator = () => {
  const status = useAuthenticationStatus();
  const isLoggedIn = status === "logged in";

  return (
    <SafeAreaProvider>
      <StyledSafeAreaView>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name={"HomeStackNavigator"}
              component={HomeStackNavigator}
              options={{ headerShown: false }}
            />
          ) : (
            <>
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
              <Stack.Screen
                name={"ForgotPasswordScreen"}
                component={ForgotPasswordScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={"ResetPasswordScreen"}
                component={ResetPasswordScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </StyledSafeAreaView>
    </SafeAreaProvider>
  );
};

export { RootStackNavigator };
