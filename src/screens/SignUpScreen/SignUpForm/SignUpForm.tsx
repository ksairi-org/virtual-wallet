import type { SignUpFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import { useCallback } from "react";

import { useNavigation } from "@react-navigation/native";
import { Spacer } from "tamagui";

import { createHandledFormElement, Form } from "@react-form";
import { BaseTouchable } from "@ui-touchables";
import { useBooleanState } from "@react-hooks";
import { useSignUpWithPersistence } from "@react-auth-core";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { BaseTextInput, CTAButton } from "@molecules";
import { CONFIRM_EMAIL_URL, signUpSchema } from "@constants";
import { LabelSemiboldLg } from "@fonts";
import { useGetFormMethods } from "@hooks";
import { showAlert } from "@utils";
import { makeRedirectUri } from "expo-auth-session";

const FormInput = createHandledFormElement<
  typeof BaseTextInput,
  SignUpFormSchema
>(BaseTextInput);

const emailRedirectTo = makeRedirectUri({
  scheme: process.env.EXPO_PUBLIC_APP_SCHEMA,
  path: CONFIRM_EMAIL_URL,
});

const SignUpForm = () => {
  const {
    state: isPasswordSecureTextEntryEnabled,
    toggleState: togglePasswordSecureTextEntryEnabled,
  } = useBooleanState(true);

  const {
    state: isConfPasswordSecureTextEntryEnabled,
    toggleState: toggleConfPasswordSecureTextEntryEnabled,
  } = useBooleanState(true);

  const navigation = useNavigation();

  const { handleSignUp, status } = useSignUpWithPersistence();

  const methods = useGetFormMethods<SignUpFormSchema>(
    {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    signUpSchema,
  );

  const handleSubmit: SubmitHandler<SignUpFormSchema> = useCallback(
    async ({ email, password, firstName, lastName }) => {
      const signUpData: SignUpWithPasswordCredentials = {
        email,
        password,
        options: {
          data: { firstName, lastName },
          emailRedirectTo,
        },
      };
      try {
        await handleSignUp(signUpData);
        navigation.navigate("LoginScreen");
        showAlert({
          title: "Please check you inbox in order to confirm your email!",
          preset: "done",
        });
      } catch (e) {
        showAlert({
          title: e.message,
          preset: "error",
        });
      }
    },
    [handleSignUp, navigation],
  );

  const {
    formState: { isValid },
  } = methods;

  return (
    <>
      <Form methods={methods}>
        <FormInput
          autoCapitalize={"words"}
          placeholder={"Name"}
          name={"firstName"}
          fontSize={"$2"}
          keyboardType={"default"}
          textContentType={"name"}
          autoFocus={true}
        />

        <Spacer size={"$md"} />

        <FormInput
          autoCapitalize={"words"}
          placeholder={"Last Name"}
          name={"lastName"}
          fontSize={"$2"}
          keyboardType={"default"}
          textContentType={"name"}
        />

        <Spacer size={"$md"} />

        <FormInput
          autoCapitalize={"none"}
          placeholder={"Email"}
          name={"email"}
          fontSize={"$2"}
          keyboardType={"email-address"}
          textContentType={"emailAddress"}
        />

        <Spacer size={"$md"} />

        <FormInput
          secureTextEntry={isPasswordSecureTextEntryEnabled}
          textContentType={"password"}
          name={"password"}
          placeholder={"Password"}
          fontSize={"$2"}
          returnKeyType={"done"}
          rightIconProps={{
            iconName: isPasswordSecureTextEntryEnabled
              ? "iconEye"
              : "iconEyeSlash",
            width: 16,
            height: 16,
            color: "$text-subtle",
            onPress: togglePasswordSecureTextEntryEnabled,
          }}
          onSubmitEditing={methods.handleSubmit(handleSubmit)}
        />

        <Spacer size={"$md"} />

        <FormInput
          secureTextEntry={isConfPasswordSecureTextEntryEnabled}
          textContentType={"password"}
          name={"confirmPassword"}
          placeholder={"Confirm Password"}
          fontSize={"$2"}
          returnKeyType={"done"}
          rightIconProps={{
            iconName: isConfPasswordSecureTextEntryEnabled
              ? "iconEye"
              : "iconEyeSlash",
            width: 16,
            height: 16,
            color: "$text-subtle",
            onPress: toggleConfPasswordSecureTextEntryEnabled,
          }}
          onSubmitEditing={methods.handleSubmit(handleSubmit)}
        />
      </Form>

      <Spacer size={"$3xl"} />
      <CTAButton
        onPress={methods.handleSubmit(handleSubmit)}
        disabled={!isValid}
        loading={status === "loading"}
      >
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          {"Create Account"}
        </LabelSemiboldLg>
      </CTAButton>
      <Spacer height={"$md"} />
      <BaseTouchable onPress={() => navigation.navigate("LoginScreen")}>
        <LabelSemiboldLg color={"$text-brand"} textAlign={"center"}>
          {"Already have an account? Log in"}
        </LabelSemiboldLg>
      </BaseTouchable>
    </>
  );
};

export { SignUpForm };
