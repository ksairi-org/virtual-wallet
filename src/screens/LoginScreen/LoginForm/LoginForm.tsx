import type { LoginFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import React, { useCallback } from "react";

import { ActivityIndicator } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Form, Spacer } from "tamagui";

import { schema } from "./constants";
import { LabelSemiboldLg, LabelSemiboldSm } from "@fonts";
import { useBooleanState } from "@react-hooks";
import { useLayoutAnimationOnChange } from "@react-native-hooks";
import { createHandledFormElement } from "libs/react-form";
import { BaseTextInput } from "src/components/molecules/inputs";
import { CtaButton } from "src/components/molecules/buttons";
import { useGlobalStore } from "@stores";
import { useLoginWithPersistence } from "@react-auth-core";

const ON_CHANGE_TEXT_ERROR_DELAY = 2000;

const FormInput = createHandledFormElement<
  typeof BaseTextInput,
  LoginFormSchema
>(BaseTextInput);

/**
 * @returns Form
 */
const LoginForm = () => {
  const {
    state: isSecureTextEntryEnabled,
    toggleState: toggleSecureTextEntryEnabled,
  } = useBooleanState(true);
  const navigation = useNavigation();
  const { handleLogIn, status } = useLoginWithPersistence();
  const hasSeenWelcomeScreen = useGlobalStore(
    (state) => state.hasSeenWelcomeScreen,
  );

  const methods = useForm<LoginFormSchema>({
    mode: "onChange",
    delayError: ON_CHANGE_TEXT_ERROR_DELAY, // delay errors for 2 seconds onChangeText
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useLayoutAnimationOnChange(status);

  const handleSubmit: SubmitHandler<LoginFormSchema> = useCallback(
    async (data) => {
      await handleLogIn({
        identifier: data.email,
        password: data.password,
      });

      if (!hasSeenWelcomeScreen) {
        navigation.navigate("WelcomeToClosetScreen");
      }
    },
    [handleLogIn, hasSeenWelcomeScreen, navigation],
  );

  const {
    formState: { isValid },
  } = methods;

  return (
    <>
      <Form methods={methods}>
        <FormInput
          autoCapitalize={"none"}
          placeholder={"Email"}
          name={"email"}
          fontSize={"$2"}
          keyboardType={"email-address"}
          textContentType={"emailAddress"}
          autoFocus={true}
        />
        <Spacer size={"$md"} />
        <FormInput
          secureTextEntry={isSecureTextEntryEnabled}
          textContentType={"password"}
          name={"password"}
          placeholder={"Password"}
          fontSize={"$2"}
          returnKeyType={"done"}
          rightIconProps={{
            iconName: isSecureTextEntryEnabled ? "iconEye" : "iconEyeSlash",
            width: 16,
            height: 16,
            color: "$text-subtle",
            onPress: toggleSecureTextEntryEnabled,
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
      >
        {status === "loading" ? (
          <ActivityIndicator size={"small"} />
        ) : (
          <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
            {"Login"}
          </LabelSemiboldLg>
        )}
      </CtaButton>
      {status === "error" ? (
        <>
          <Spacer size={"$sm"} />
          <LabelSemiboldSm color={"$text-error"}>
            {"There was an error with your credentials. Please try again."}
          </LabelSemiboldSm>
        </>
      ) : null}
    </>
  );
};

export { LoginForm };
