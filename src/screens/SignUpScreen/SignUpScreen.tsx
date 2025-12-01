import { StyleSheet } from "react-native";

import { Image } from "@expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spacer } from "tamagui";

import { SignUpForm } from "./SignUpForm";
import { Containers } from "@ui-containers";
import { HeadingBoldXl } from "@fonts";
import { images } from "@images";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

const SignUpScreen = () => (
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
        <Image
          width={124}
          height={75}
          source={images["utility-logo"]}
          maxFontScaleToApply={1.2}
        />
        <Spacer height={"$2xl"} />
        <HeadingBoldXl>{"Create Account"}</HeadingBoldXl>
        <Spacer height={"$md"} />
        <SignUpForm />
      </Containers.SubY>
    </KeyboardAwareScrollView>
  </Containers.Screen>
);

export { SignUpScreen };
