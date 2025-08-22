import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavigatorParamList } from "../types";

type RootStackNavigatorParamList = {
  WelcomeScreen: undefined;
  LoginScreen: { url?: string } | undefined;
  HomeStackNavigator: NavigatorScreenParams<HomeStackNavigatorParamList>;
  SignUpScreen: undefined;
  ResetPasswordScreen: {
    url: string;
  };
  ForgotPasswordScreen: undefined;
};

type RootStackNavigatorScreenProps<
  T extends keyof RootStackNavigatorParamList,
> = NativeStackScreenProps<RootStackNavigatorParamList, T>;

type RootStackNavigationProps = RootStackNavigatorScreenProps<
  keyof RootStackNavigatorParamList
>;

type RootStackNavigation = RootStackNavigationProps["navigation"];

// The pattern here is to import the ParamList for all new Navigators and add them to the `AllNavigationParamLists` intersection type
type AllNavigationParamLists = RootStackNavigatorParamList &
  HomeStackNavigatorParamList;

type AppNavigationScreenName = keyof AllNavigationParamLists;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends AllNavigationParamLists {}
  }
}

export type {
  RootStackNavigatorParamList,
  RootStackNavigatorScreenProps,
  RootStackNavigation,
  RootStackNavigationProps,
  AppNavigationScreenName,
};
