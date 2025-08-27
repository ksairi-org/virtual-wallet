import type { ParamListBase } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ComponentProps } from "react";

const createStackNavigator = <T extends ParamListBase>() => {
  const Stack = createNativeStackNavigator<T>();

  const Navigator = (
    props: Omit<ComponentProps<typeof Stack.Navigator>, "id">,
  ) => <Stack.Navigator id={undefined} {...props} />;

  return { Navigator, Screen: Stack.Screen, Group: Stack.Group };
};

export { createStackNavigator };
