import React from "react";
import RNFS, { writeFile } from "react-native-fs";

console.log("[DETOX] Using mocked react-native-vision-camera");

export class MockedCamera extends React.PureComponent {
  static getAvailableCameraDevices() {
    return [
      {
        id: "",
        position: "back" as const,
        physicalDevices: [],
        name: "",
        hasFlash: false,
        hasTorch: false,
        isMultiCam: false,
        minFocusDistance: 0,
        minZoom: 0,
        maxZoom: 1,
        neutralZoom: 1,
        minExposure: 0,
        maxExposure: 1,
        formats: [],
        supportsLowLightBoost: false,
        supportsRawCapture: false,
        supportsFocus: false,
        hardwareLevel: "limited" as const,
        sensorOrientation: "portrait" as const,
      },
    ];
  }

  static async getCameraPermissionStatus() {
    return "granted";
  }

  static async requestCameraPermission() {
    return "granted";
  }

  async takePhoto() {
    const writePath = `${RNFS.DocumentDirectoryPath}/simulated_camera_photo.png`;
    const imageDataBase64 = "some_large_base_64_encoded_simulated_camera_photo";
    await writeFile(writePath, imageDataBase64, "base64");
    return { path: writePath };
  }

  render() {
    return null;
  }
}
