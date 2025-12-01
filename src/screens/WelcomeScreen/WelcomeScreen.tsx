import { useUserStore } from "@stores";
import { LabelSemiboldLg } from "@fonts";
import { Containers } from "@ui-containers";
import { CTAButton } from "@molecules";
import { Trans } from "@lingui/react/macro";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();
  const setKeyValue = useUserStore((state) => state.setKeyValue);
  const handleOnPress = () => {
    setKeyValue("hasSeenWelcomeScreen", true);
    router.navigate("/profile");
  };

  return (
    <Containers.Screen backgroundColor={"$background-body"}>
      <Containers.SubY flex={1} alignItems="center" justifyContent="center">
        <LabelSemiboldLg color={"$text-body"}>
          {"WelcomeScreen"}
        </LabelSemiboldLg>
        <CTAButton onPress={handleOnPress}>
          <LabelSemiboldLg color={"$text-success"}>
            <Trans>{"Continue to App"}</Trans>
          </LabelSemiboldLg>
        </CTAButton>
      </Containers.SubY>
    </Containers.Screen>
  );
};

export { WelcomeScreen };
