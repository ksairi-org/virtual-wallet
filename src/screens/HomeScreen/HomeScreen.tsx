import { LabelSemiboldLg } from "@fonts";
import { Containers } from "@ui-containers";

const HomeScreen = () => (
  <Containers.Screen backgroundColor={"$background-action"}>
    <Containers.SubY>
      <LabelSemiboldLg color={"black"}>{"HomeScreen"}</LabelSemiboldLg>
    </Containers.SubY>
  </Containers.Screen>
);

export { HomeScreen };
