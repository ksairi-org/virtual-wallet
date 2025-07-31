import * as Sentry from "@sentry/react";

//import { saveRegisterDevice } from "@utility-nyc/react-query-sdk"; TODO: ADD THIS TO BACKEND
import { getFirebaseDeviceToken } from "./getFirebaseDeviceToken";
import { getIosIdForVendorAsync, getAndroidId } from "expo-application";

const setFirebaseDeviceToken = async (employeeId?: string) => {
  try {
    if (!employeeId) {
      return;
    }

    const deviceId = (await getIosIdForVendorAsync()) || getAndroidId();
    const deviceToken = await getFirebaseDeviceToken();

    // saveRegisterDevice(employeeId, {
    //   device_id: deviceId,
    //   device_token: deviceToken,
    // });
  } catch (error) {
    Sentry.captureException(error);
  }
};

export { setFirebaseDeviceToken };
