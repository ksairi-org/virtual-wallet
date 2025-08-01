import { LabelSemiboldLg } from "@fonts";
import { Containers } from "@ui-containers";

const WelcomeScreen = () => (
  <Containers.Screen backgroundColor={"$background-action"}>
    <Containers.SubY>
      <LabelSemiboldLg color={"black"}>{"WelcomeScreen"}</LabelSemiboldLg>
    </Containers.SubY>
  </Containers.Screen>
);

export { WelcomeScreen };
