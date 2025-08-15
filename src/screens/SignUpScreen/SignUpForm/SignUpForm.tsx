import type { SignUpFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Spacer } from "tamagui";

import { LabelSemiboldLg } from "@fonts";
import { createHandledFormElement, Form } from "@react-form";
import { BaseTouchable } from "@ui-touchables";
import { CtaButton } from "src/components/molecules/buttons";
import { BaseTextInput } from "src/components/molecules/inputs";
import { useBooleanState } from "@react-hooks";
import { signUpSchema } from "src/constants";
import * as Burnt from "burnt";
import { useSignUpWithPersistence } from "@react-auth-core";

const ON_CHANGE_TEXT_ERROR_DELAY = 2000;

const FormInput = createHandledFormElement<
  typeof BaseTextInput,
  SignUpFormSchema
>(BaseTextInput);

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

  const methods = useForm<SignUpFormSchema>({
    mode: "onChange",
    delayError: ON_CHANGE_TEXT_ERROR_DELAY, // delay errors for 2 seconds onChangeText
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit: SubmitHandler<SignUpFormSchema> = useCallback(
    async (data) => {
      try {
        await handleSignUp(data);
        navigation.navigate("WelcomeScreen");

        Burnt.toast({
          title: "User created successfully!",
          preset: "done",
        });
      } catch (e) {
        Burnt.toast({
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
      <CtaButton
        onPress={methods.handleSubmit(handleSubmit)}
        width={"$full"}
        borderRadius={"$radius.xl"}
        padding={"$md"}
        disabled={!isValid}
        loading={status === "loading"}
      >
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          {"Create Account"}
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

export { SignUpForm };
