import type { LoginFormSchema } from "./types";
import type { SubmitHandler } from "react-hook-form";

import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Spacer } from "tamagui";

import { LabelSemiboldLg } from "@fonts";
import { useBooleanState } from "@react-hooks";
import { useLayoutAnimationOnChange } from "@react-native-hooks";
import { BaseTextInput } from "src/components/molecules/inputs";
import { CtaButton } from "src/components/molecules/buttons";
import { useUserStore } from "@stores";
import { useLoginWithPersistence } from "@react-auth-core";
import { RootStackNavigation } from "src/navigation/types";
import { createHandledFormElement, Form } from "@react-form";
import { loginSchema } from "src/constants";
import * as Burnt from "burnt";

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
  const navigation = useNavigation<RootStackNavigation>();
  const { handleLogInWithEmail, status } = useLoginWithPersistence();
  const hasSeenWelcomeScreen = useUserStore(
    (state) => state.hasSeenWelcomeScreen,
  );

  const methods = useForm<LoginFormSchema>({
    mode: "onChange",
    delayError: ON_CHANGE_TEXT_ERROR_DELAY, // delay errors for 2 seconds onChangeText
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useLayoutAnimationOnChange(status);

  const handleSubmit: SubmitHandler<LoginFormSchema> = useCallback(
    async (data) => {
      try {
        await handleLogInWithEmail({
          email: data.email,
          password: data.password,
        });
        if (!hasSeenWelcomeScreen) {
          navigation.navigate("WelcomeScreen");
        }
      } catch (e) {
        Burnt.toast({
          title: e.message,
          preset: "error",
        });
        console.log(e);
      }
    },
    [handleLogInWithEmail, hasSeenWelcomeScreen, navigation],
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
        loading={status === "loading"}
      >
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          {"Login"}
        </LabelSemiboldLg>
      </CtaButton>
    </>
  );
};

export { LoginForm };
