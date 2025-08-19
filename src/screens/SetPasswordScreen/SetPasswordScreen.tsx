import { StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spacer } from "tamagui";

import { SetPasswordForm } from "./SetPasswordForm";
import { Containers } from "@ui-containers";
import { HeadingBoldXl, BodyRegularXl } from "@fonts";
import { BaseIcon } from "@icons";
import { RootStackNavigatorScreenProps } from "@navigation/types";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

type SetPasswordScreenProps =
  RootStackNavigatorScreenProps<"SetPasswordScreen">;

const SetPasswordScreen = ({
  route: {
    params: { email, fullName },
  },
}: SetPasswordScreenProps) => (
  <Containers.Screen shouldAutoResize={false}>
    <KeyboardAwareScrollView
      extraHeight={250}
      enableOnAndroid={true}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      <Containers.SubY flexGrow={1} alignItems={"center"}>
        <Spacer flexGrow={0.5} />
        <BaseIcon
          width={128}
          height={128}
          iconName={"iconLockOpen"}
          maxFontScaleToApply={1.2}
          color={"$text-subtle"}
        />
        <Spacer height={"$2xl"} />
        <HeadingBoldXl>{"Set a Password"}</HeadingBoldXl>
        <Spacer height={"$md"} />
        <BodyRegularXl
          opacity={0.5}
          textAlign={"center"}
          paddingHorizontal={"$2xl"}
          color={"$text-body"}
        >
          {"Choose a strong password for your account."}
        </BodyRegularXl>
        <Spacer height={"$2xl"} />
        <SetPasswordForm email={email} fullName={fullName} />
      </Containers.SubY>
    </KeyboardAwareScrollView>
  </Containers.Screen>
);

export { SetPasswordScreen };
