import type { ForgotPasswordFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import { useCallback } from "react";
import { makeRedirectUri } from "expo-auth-session";

import { useNavigation } from "@react-navigation/native";
import { Spacer } from "tamagui";

import { createHandledFormElement, Form } from "@react-form";
import { useBooleanState } from "@react-hooks";
import { BaseTouchable } from "@ui-touchables";
import { BaseTextInput, CtaButton } from "@molecules";
import { LabelSemiboldLg } from "@fonts";
import { RESET_PASSWORD_URL, forgotPasswordSchema } from "@constants";
import { supabase } from "@backend";
import * as Burnt from "burnt";
import { useGetFormMethods } from "@hooks";

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
        Burnt.alert({
          title:
            "An email has been sent with instructions to reset your password.",
          preset: "done",
        });
        navigation.navigate("LoginScreen");
      } catch (e) {
        Burnt.alert({
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

      <CtaButton
        onPress={methods.handleSubmit(handleSubmit)}
        width={"$full"}
        borderRadius={"$radius.xl"}
        padding={"$md"}
        disabled={!isValid}
        loading={isLoading}
      >
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          {"Submit"}
        </LabelSemiboldLg>
      </CtaButton>
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
