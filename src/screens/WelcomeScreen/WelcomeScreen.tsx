import { useUserStore } from "@stores";
import { LabelSemiboldLg } from "@fonts";
import { Containers } from "@ui-containers";
import { CtaButton } from "@molecules";
import { RootStackNavigatorScreenProps } from "@navigation/types";

const WelcomeScreen = ({
  navigation,
}: RootStackNavigatorScreenProps<"WelcomeScreen">) => {
  const setKeyValue = useUserStore((state) => state.setKeyValue);
  const handleOnPress = () => {
    setKeyValue("hasSeenWelcomeScreen", true);
    navigation.navigate("HomeStackNavigator", { screen: "AccountScreen" });
  };
  return (
    <Containers.Screen backgroundColor={"$background-action"}>
      <Containers.SubY flex={1} alignItems="center" justifyContent="center">
        <LabelSemiboldLg color={"$text-body"}>
          {"WelcomeScreen"}
        </LabelSemiboldLg>
        <CtaButton onPress={handleOnPress}>{"Continue to App"}</CtaButton>
      </Containers.SubY>
    </Containers.Screen>
  );
};

export { WelcomeScreen };
