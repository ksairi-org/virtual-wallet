//import { useUserStore } from "@stores";
import { LabelSemiboldLg } from "@fonts";
import { Containers } from "@ui-containers";

const WelcomeScreen = () => {
  // const setKeyValue = useUserStore((state) => state.setKeyValue);
  // setKeyValue("hasSeenWelcomeScreen", true);
  return (
    <Containers.Screen backgroundColor={"$background-action"}>
      <Containers.SubY>
        <LabelSemiboldLg color={"black"}>{"WelcomeScreen"}</LabelSemiboldLg>
      </Containers.SubY>
    </Containers.Screen>
  );
};

export { WelcomeScreen };
