import type { SetPasswordFormSchema } from './types';
import type { SubmitHandler } from 'react-hook-form';

import { useCallback } from 'react';

import { ActivityIndicator } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useSignUpWithPersistence } from '@utility-nyc/react-auth-core';
import { Form, createHandledFormElement } from '@utility-nyc/react-form';
import { useBooleanState } from '@utility-nyc/react-hooks';
import { useLayoutAnimationOnChange } from '@utility-nyc/react-native-hooks';
import { BaseTouchable } from '@utility-nyc/ui-touchables';
import { useForm } from 'react-hook-form';
import { Spacer } from 'tamagui';

import { BodyBoldMd, LabelSemiboldLg } from '@kitchen-sink-app/atoms';
import { BaseTextInput, CtaButton } from '@kitchen-sink-app/molecules';
import { useGlobalStore } from '@kitchen-sink-app/stores';

import { schema } from './constants';
import { getFirstAndLastName } from './utils';

const ON_CHANGE_TEXT_ERROR_DELAY = 2000;

const FormInput = createHandledFormElement<
  typeof BaseTextInput,
  SetPasswordFormSchema
>(BaseTextInput);

type SetPasswordFormProps = {
  fullName: string;
  email: string;
};

const SetPasswordForm = ({ fullName, email }: SetPasswordFormProps) => {
  const navigation = useNavigation();
  const hasSeenWelcomeScreen = useGlobalStore(
    (state) => state.hasSeenWelcomeScreen,
  );
  const { handleSignUp, status } = useSignUpWithPersistence();

  const {
    state: isSecureTextEntryEnabled,
    toggleState: toggleSecureTextEntryEnabled,
  } = useBooleanState(true);

  const methods = useForm<SetPasswordFormSchema>({
    mode: 'onChange',
    delayError: ON_CHANGE_TEXT_ERROR_DELAY, // delay errors for 2 seconds onChangeText
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit: SubmitHandler<SetPasswordFormSchema> = useCallback(
    async (data) => {
      const { firstName, lastName } = getFirstAndLastName(fullName);

      await handleSignUp({
        identifierType: 'email',
        identifier: email,
        password: data.password,
        profile: { firstName, lastName },
      });

      if (!hasSeenWelcomeScreen) {
        navigation.navigate('WelcomeToClosetScreen');
      }
    },
    [email, fullName, handleSignUp, hasSeenWelcomeScreen, navigation],
  );

  const {
    formState: { isValid },
  } = methods;

  useLayoutAnimationOnChange(status);

  return (
    <>
      <Form methods={methods}>
        <FormInput
          autoFocus={true}
          placeholder={'Password'}
          name={'password'}
          fontSize={'$2'}
          textContentType={'newPassword'}
          secureTextEntry={isSecureTextEntryEnabled}
          rightIconProps={{
            iconName: isSecureTextEntryEnabled ? 'iconEye' : 'iconEyeSlash',
            width: 16,
            height: 16,
            color: '$text-subtle',
            onPress: toggleSecureTextEntryEnabled,
          }}
          returnKeyType={'done'}
          onSubmitEditing={methods.handleSubmit(handleSubmit)}
        />
      </Form>
      <Spacer size={'$3xl'} />
      {status === 'error' ? (
        <>
          <BodyBoldMd alignSelf={'flex-start'} color={'$text-error'}>
            {'There was an error signing up. Please try again.'}
          </BodyBoldMd>
          <Spacer size={'$sm'} />
        </>
      ) : null}
      <CtaButton
        onPress={methods.handleSubmit(handleSubmit)}
        width={'$full'}
        borderRadius={'$radius.xl'}
        padding={'$md'}
        disabled={!isValid}
      >
        {status === 'loading' ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <LabelSemiboldLg textAlign={'center'} color={'$text-action-inverse'}>
            {'Confirm Password'}
          </LabelSemiboldLg>
        )}
      </CtaButton>
      <Spacer height={'$md'} />
      <BaseTouchable onPress={() => navigation.navigate('LoginScreen')}>
        <LabelSemiboldLg color={'$text-brand'} textAlign={'center'}>
          {'Already have an account? Log in'}
        </LabelSemiboldLg>
      </BaseTouchable>
    </>
  );
};

export { SetPasswordForm };
