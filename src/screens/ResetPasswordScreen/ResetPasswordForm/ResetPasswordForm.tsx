import type { ResetPasswordFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import { useCallback } from "react";

import { Spacer } from "tamagui";

import { createHandledFormElement, Form } from "@react-form";
import { useBooleanState } from "@react-hooks";
import { BaseTouchable } from "@ui-touchables";
import { BaseTextInput, CTAButton } from "@molecules";
import { LabelSemiboldLg } from "@fonts";
import { resetPasswordSchema } from "@constants";
import { useGetFormMethods } from "@hooks";
import { showToast } from "@utils";
import { supabase } from "@react-auth-client";
import { useRouter } from "expo-router";

const FormInput = createHandledFormElement<
  typeof BaseTextInput,
  ResetPasswordFormSchema
>(BaseTextInput);

const ResetPasswordForm = () => {
  const {
    state: isPasswordSecureTextEntryEnabled,
    toggleState: togglePasswordSecureTextEntryEnabled,
  } = useBooleanState(true);

  const {
    state: isConfPasswordSecureTextEntryEnabled,
    toggleState: toggleConfPasswordSecureTextEntryEnabled,
  } = useBooleanState(true);
  const router = useRouter();

  const { state: isLoading, toggleState: toggleIsLoading } =
    useBooleanState(false);

  const methods = useGetFormMethods<ResetPasswordFormSchema>(
    { password: "", confirmPassword: "" },
    resetPasswordSchema,
  );

  const handleSubmit: SubmitHandler<ResetPasswordFormSchema> = useCallback(
    async (data) => {
      try {
        toggleIsLoading();
        await supabase.auth.updateUser({ password: data.password });
        showToast({
          title:
            "Password reset successfully! Please log in with your new password.",
          preset: "done",
        });
        router.navigate("/login");
      } catch (e) {
        showToast({
          title: e.message,
          preset: "error",
        });
      } finally {
        toggleIsLoading();
      }
    },
    [router, toggleIsLoading],
  );

  const {
    formState: { isValid },
  } = methods;

  return (
    <>
      <Form methods={methods}>
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
        loading={isLoading}
      >
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          {"Submit"}
        </LabelSemiboldLg>
      </CTAButton>
      <Spacer height={"$md"} />
      <BaseTouchable onPress={() => router.navigate("LoginScreen")}>
        <LabelSemiboldLg color={"$text-brand"} textAlign={"center"}>
          {"Already have an account? Log in"}
        </LabelSemiboldLg>
      </BaseTouchable>
    </>
  );
};

export { ResetPasswordForm };
