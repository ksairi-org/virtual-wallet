import { MockedCamera } from "mocked-camera/MockedCamera";
import * as Device from "expo-device";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking, StyleSheet } from "react-native";
import { PhotoFile, Camera as RealCamera } from "react-native-vision-camera";
import { LabelSemiboldLg } from "@fonts";
import { Trans } from "@lingui/react/macro";
import { SubmitButton } from "@molecules";
import { Spacer } from "tamagui";

type VisionCameraProps = {
  onTakePhoto?: (photo: PhotoFile) => void;
  onClose?: () => void;
};

const Camera = Device.isDevice ? RealCamera : MockedCamera;
const device = Camera.getAvailableCameraDevices().find(
  (d) => d.position === "front",
);

const VisionCamera = ({ onTakePhoto, onClose }: VisionCameraProps) => {
  const [hasPermission, setHasPermission] = useState(false);
  const camera = useRef<RealCamera>(null);
  const appState = useRef(AppState.currentState);

  const checkPermission = useCallback(async () => {
    if ((await Camera.getCameraPermissionStatus()) === "denied") {
      const permission = await Camera.requestCameraPermission();
      if (permission === "authorized") {
        setHasPermission(true);
        return;
      }
      Linking.openSettings();
      setHasPermission(false);
      return;
    } else {
      setHasPermission(true);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkPermission();
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const handleTakePhoto = async () => {
    const photo = await camera.current?.takePhoto();
    onTakePhoto(photo);
  };

  if (!hasPermission) {
    return null;
  }

  return (
    <>
      {Device.isDevice ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        <MockedCamera ref={camera} />
      )}
      <SubmitButton onPress={handleTakePhoto}>
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          <Trans>{"Take Photo"}</Trans>
        </LabelSemiboldLg>
      </SubmitButton>

      <Spacer size={"$md"} />

      <SubmitButton onPress={() => onClose?.()}>
        <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
          <Trans>{"Close"}</Trans>
        </LabelSemiboldLg>
      </SubmitButton>
    </>
  );
};

export { VisionCamera };
