import { StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Spacer } from "tamagui";

import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Containers } from "@ksairi-org/ui-containers";
import { BodyRegularXl } from "@fonts";
import { BaseIcon } from "@icons";
import { Trans } from "@lingui/react/macro";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

const ForgotPasswordScreen = () => (
  <Containers.Screen shouldAutoResize={false}>
    <KeyboardAwareScrollView
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
        <Spacer height={"$md"} />
        <BodyRegularXl
          opacity={0.5}
          textAlign={"center"}
          paddingHorizontal={"$2xl"}
          color={"$text-body"}
        >
          <Trans>Reset your password for your account.</Trans>
        </BodyRegularXl>
        <Spacer height={"$2xl"} />
        <ForgotPasswordForm />
      </Containers.SubY>
    </KeyboardAwareScrollView>
  </Containers.Screen>
);

export { ForgotPasswordScreen };
