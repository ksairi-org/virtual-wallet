import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type HomeStackNavigatorParamList = {
  HomeScreen: undefined;
  AccountScreen: undefined;
};

type HomeStackNavigatorScreenProps<
  T extends keyof HomeStackNavigatorParamList,
> = NativeStackScreenProps<HomeStackNavigatorParamList, T>;

export type { HomeStackNavigatorParamList, HomeStackNavigatorScreenProps };
