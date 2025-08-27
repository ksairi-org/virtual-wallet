import type { ForgotPasswordFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import { useCallback } from "react";
import { makeRedirectUri } from "expo-auth-session";

import { useNavigation } from "@react-navigation/native";
import { Spacer } from "tamagui";

import { createHandledFormElement, Form } from "@react-form";
import { useBooleanState } from "@react-hooks";
import { BaseTouchable } from "@ui-touchables";
import { BaseTextInput, SubmitButton } from "@molecules";
import { LabelSemiboldLg } from "@fonts";
import { RESET_PASSWORD_URL, forgotPasswordSchema } from "@constants";
import { useGetFormMethods } from "@hooks";
import { showAlert } from "@utils";
import { supabase } from "@react-auth-client";

const FormInput = createHandledFormElement<
  typeof BaseTextInput,
  ForgotPasswordFormSchema
>(BaseTextInput);

const redirectTo = makeRedirectUri({
  scheme: process.env.EXPO_PUBLIC_APP_SCHEMA,
  path: RESET_PASSWORD_URL,
});

const ForgotPasswordForm = () => {
  const navigation = useNavigation();

  const { state: isLoading, toggleState: toggleIsLoading } =
    useBooleanState(false);

  const methods = useGetFormMethods<ForgotPasswordFormSchema>(
    { email: "" },
    forgotPasswordSchema,
  );

  const handleSubmit: SubmitHandler<ForgotPasswordFormSchema> = useCallback(
    async (data) => {
      try {
        toggleIsLoading();
        await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo,
        });
        showAlert({
          title:
            "An email has been sent with instructions to reset your password.",
          preset: "done",
        });
        navigation.navigate("LoginScreen");
      } catch (e) {
        showAlert({
          title: e.message,
          preset: "error",
        });
      } finally {
        toggleIsLoading();
      }
    },
    [navigation, toggleIsLoading],
  );

  const {
    formState: { isValid },
  } = methods;

  return (
    <>
      <Form methods={methods}>
        <FormInput
          autoFocus={true}
          placeholder={"Email"}
          name={"email"}
          fontSize={"$2"}
          autoCapitalize="none"
          textContentType={"emailAddress"}
          returnKeyType={"done"}
          onSubmitEditing={methods.handleSubmit(handleSubmit)}
        />
      </Form>
      <Spacer size={"$3xl"} />

      <SubmitButton
        onPress={methods.handleSubmit(handleSubmit)}
        width={"$full"}
        disabled={!isValid}
        loading={isLoading}
      >
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          {"Submit"}
        </LabelSemiboldLg>
      </SubmitButton>
      <Spacer height={"$md"} />
      <BaseTouchable onPress={() => navigation.navigate("LoginScreen")}>
        <LabelSemiboldLg color={"$text-brand"} textAlign={"center"}>
          {"Already have an account? Log in"}
        </LabelSemiboldLg>
      </BaseTouchable>
    </>
  );
};

export { ForgotPasswordForm };
