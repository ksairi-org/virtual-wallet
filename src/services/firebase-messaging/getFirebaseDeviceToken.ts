import { getApp } from "@react-native-firebase/app";
import { getMessaging } from "@react-native-firebase/messaging";

const messaging = getMessaging(getApp());

const getFirebaseDeviceToken = async () => {
  const fcmDeviceToken = await messaging.getToken();

  return fcmDeviceToken;
};

export { getFirebaseDeviceToken };
