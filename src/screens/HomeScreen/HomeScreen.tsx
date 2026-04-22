import { LabelSemiboldLg } from "@fonts";
import { Containers } from "@ksairi/ui-containers";
import { Trans } from "@lingui/react/macro";

const HomeScreen = () => (
  <Containers.Screen backgroundColor={"$background-action"}>
    <Containers.SubY>
      <LabelSemiboldLg color={"black"}><Trans>HomeScreen</Trans></LabelSemiboldLg>
    </Containers.SubY>
  </Containers.Screen>
);

export { HomeScreen };
