import { PermissionsAndroid, Platform } from "react-native";

import {
  AuthorizationStatus,
  getMessaging,
} from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";

const messaging = getMessaging(getApp());

const requestIOSPermissions = async () => {
  const authStatus = await messaging.requestPermission();
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
};

const requestAndroidPermissions = async () => {
  const permissionStatus = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  console.log(permissionStatus);
};

const requestMessagingPermissions = async () => {
  switch (Platform.OS) {
    case "android":
      await requestAndroidPermissions();

      break;

    case "ios":
      await requestIOSPermissions();

      break;
  }
};

export { requestMessagingPermissions };
