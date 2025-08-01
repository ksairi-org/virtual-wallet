import { Platform } from 'react-native';

import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

/**
 * A type guard for whether the given `error` is an object with a `code` property.
 * @param error - The error to check.
 * @returns Whether the given `error` is an object with a `code` property.
 */
const isErrorWithCode = (error: unknown): error is Error & { code: string } =>
  typeof error === 'object' && error !== null && 'code' in error;

const isAppleAuthSupported =
  Platform.OS === 'ios'
    ? appleAuth.isSupported
    : Platform.OS === 'android'
    ? appleAuthAndroid.isSupported
    : false;

export { isErrorWithCode, isAppleAuthSupported };
