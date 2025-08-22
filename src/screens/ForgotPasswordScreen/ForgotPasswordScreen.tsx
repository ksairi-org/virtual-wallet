import { StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spacer } from "tamagui";

import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Containers } from "@ui-containers";
import { BodyRegularXl } from "@fonts";
import { BaseIcon } from "@icons";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

const ForgotPasswordScreen = () => (
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
        <Spacer height={"$md"} />
        <BodyRegularXl
          opacity={0.5}
          textAlign={"center"}
          paddingHorizontal={"$2xl"}
          color={"$text-body"}
        >
          {"Reset your password for your account."}
        </BodyRegularXl>
        <Spacer height={"$2xl"} />
        <ForgotPasswordForm />
      </Containers.SubY>
    </KeyboardAwareScrollView>
  </Containers.Screen>
);

export { ForgotPasswordScreen };
