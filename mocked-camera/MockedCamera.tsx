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
    const writePath = `${RNFS.DocumentDirectoryPath}/simulated_camera_photo.jpeg`;
    const imageDataBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    await writeFile(writePath, imageDataBase64, "base64");
    return { path: writePath };
  }

  render() {
    return null;
  }
}
