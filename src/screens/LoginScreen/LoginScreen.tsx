import { StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spacer } from "tamagui";

import { LoginForm } from "./LoginForm";
import { BaseIcon } from "@icons";
import { Containers } from "@ui-containers";
import React, { useEffect } from "react";
import { RootStackNavigatorScreenProps } from "src/navigation/types";
import { HeadingBoldXl, BodyRegularXl } from "@fonts";
import { AppleSignInButton } from "@react-native-auth-apple";
import {
  AppleSignInError,
  AppleSignInResponse,
} from "libs/react-native-auth-apple/types";
import {
  GoogleSigninButton,
  useSignInWithGoogle,
} from "@react-native-auth-google";
import {
  GoogleSignInError,
  GoogleSignInResponse,
} from "libs/react-native-auth-google/types";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

type LoginScreenProps = RootStackNavigatorScreenProps<"LoginScreen">;

const LoginScreen = (_props: LoginScreenProps) => {
  const { handleSignOutWithGoogle } = useSignInWithGoogle();
  useEffect(() => {
    handleSignOutWithGoogle();
  }, [handleSignOutWithGoogle]);

  const handleSignInWithAppleSuccess = (response: AppleSignInResponse) => {
    console.log(response);
  };

  const handleSignInWithAppleError = (response: AppleSignInError) => {
    console.log(response);
  };

  const handleSignInWithGoogleSuccess = (response: GoogleSignInResponse) => {
    console.log(response);
  };

  const handleSignInWithGoogleError = (response: GoogleSignInError) => {
    console.log(response);
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
              onSuccess={handleSignInWithAppleSuccess}
              onError={handleSignInWithAppleError}
            />
            <GoogleSigninButton
              onPress={handleSignOutWithGoogle}
              onSuccess={handleSignInWithGoogleSuccess}
              onError={handleSignInWithGoogleError}
            />
          </Containers.SubX>
        </Containers.SubY>
      </KeyboardAwareScrollView>
    </Containers.Screen>
  );
};

export { LoginScreen };
