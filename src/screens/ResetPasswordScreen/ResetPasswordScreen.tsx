import { StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Spacer } from "tamagui";

import { ResetPasswordForm } from "./ResetPasswordForm";
import { Containers } from "@ui-containers";
import { BodyRegularXl } from "@fonts";
import { BaseIcon } from "@icons";
import { supabase } from "@backend";
import { RootStackNavigatorScreenProps } from "@navigation/types";
import { useEffect } from "react";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { useNavigation } from "@react-navigation/native";
import { showAlert } from "@utils";

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

const ResetPasswordScreen = ({
  route,
}: RootStackNavigatorScreenProps<"ResetPasswordScreen">) => {
  const { url } = route.params ?? {};
  const navigation = useNavigation();
  useEffect(() => {
    const setSupabaseSession = async (
      accessToken: string,
      refreshToken: string,
    ) => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        throw error;
      }
    };
    const handleDeepLinkAuth = async () => {
      try {
        if (url) {
          const { errorCode, params } = QueryParams.getQueryParams(url);
          if (errorCode) {
            throw new Error(errorCode);
          }
          if (!params.access_token || !params.refresh_token) {
            throw new Error("No token found in the URL");
          }
          if (params.type !== "recovery") {
            throw new Error("Invalid link type");
          }
          await setSupabaseSession(params.access_token, params.refresh_token);
        }
      } catch (error) {
        console.error("Error handling deep link:", error);
        showAlert({
          title: "Failed to authenticate from email link",
          preset: "error",
        });
        setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 5000);
      }
    };
    handleDeepLinkAuth();
  }, [navigation, url]);

  return (
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
          <ResetPasswordForm />
        </Containers.SubY>
      </KeyboardAwareScrollView>
    </Containers.Screen>
  );
};

export { ResetPasswordScreen };
