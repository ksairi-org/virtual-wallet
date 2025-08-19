import { Platform, StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spacer } from "tamagui";

import { LoginForm } from "./LoginForm";
import { BaseIcon } from "@icons";
import { Containers } from "@ui-containers";
import React, { useRef } from "react";
import { HeadingBoldXl, BodyRegularXl, LabelSemiboldLg } from "@fonts";
import {
  AppleSignInButton,
  AppleSignInButtonHandle,
  AppleSignInError,
  AppleSignInResponse,
} from "@react-native-auth-apple";

import {
  GoogleSigninButton,
  GoogleSignInError,
  GoogleSignInResponse,
} from "@react-native-auth-google";

import { useAppState } from "@react-native-hooks";
import { BaseTouchable } from "@ui-touchables";
import { RootStackNavigatorScreenProps } from "@navigation/types";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

type LoginScreenProps = RootStackNavigatorScreenProps<"LoginScreen">;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const appleSignInButtonRef = useRef<AppleSignInButtonHandle>(null);
  const hasInitializedAppleSignIn = useRef(false);
  const [prevState, appState] = useAppState();

  if (
    Platform.OS === "ios" &&
    prevState === "background" &&
    appState === "active" &&
    hasInitializedAppleSignIn.current
  ) {
    // if user was not logged in in the iOS device and after being logged in
    // we trigger the on press again
    appleSignInButtonRef.current.press();
  }

  const handleSignInWithAppleSuccess = (response: AppleSignInResponse) => {
    console.log(response);
  };

  const handleSignInWithAppleError = (response: AppleSignInError) => {
    console.log("response", response);
  };

  const handleSignInWithGoogleSuccess = (response: GoogleSignInResponse) => {
    console.log(response);
  };

  const handleSignInWithGoogleError = (response: GoogleSignInError) => {
    console.log("response", response);
  };

  const handleAppleSignInOnPress = () => {
    hasInitializedAppleSignIn.current = true;
  };

  return (
    <Containers.Screen shouldAutoResize={false}>
      <KeyboardAwareScrollView
        extraHeight={200}
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
          <HeadingBoldXl>{"Login"}</HeadingBoldXl>
          <Spacer height={"$md"} />
          <BodyRegularXl
            opacity={0.5}
            textAlign={"center"}
            paddingHorizontal={"$2xl"}
            color={"$text-body"}
          >
            {"Enter your email and password to login."}
          </BodyRegularXl>
          <Spacer height={"$2xl"} />
          <LoginForm />
          <Containers.SubX>
            <AppleSignInButton
              ref={appleSignInButtonRef}
              onPress={handleAppleSignInOnPress}
              onSuccess={handleSignInWithAppleSuccess}
              onError={handleSignInWithAppleError}
            />
            <GoogleSigninButton
              onSuccess={handleSignInWithGoogleSuccess}
              onError={handleSignInWithGoogleError}
            />
          </Containers.SubX>
          <Spacer height={"$md"} />
          <BaseTouchable onPress={() => navigation.navigate("SignUpScreen")}>
            <LabelSemiboldLg color={"$text-brand"} textAlign={"center"}>
              {"Don't have account? Sign up"}
            </LabelSemiboldLg>
          </BaseTouchable>
        </Containers.SubY>
      </KeyboardAwareScrollView>
    </Containers.Screen>
  );
};

export { LoginScreen };
