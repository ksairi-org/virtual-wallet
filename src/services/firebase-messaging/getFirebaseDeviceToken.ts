import messaging from '@react-native-firebase/messaging';

const getFirebaseDeviceToken = async () => {
  const fcmDeviceToken = await messaging().getToken();

  return fcmDeviceToken;
};

export { getFirebaseDeviceToken };
