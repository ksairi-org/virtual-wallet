import { useEffect, useRef, useState } from "react";
import { Containers } from "@ui-containers";
import { Spacer, styled } from "tamagui";
import { BaseTextInput, SubmitButton } from "@molecules";
import { BodyRegularSm, LabelSemiboldLg } from "@fonts";
import { useAuthStore } from "@react-auth-storage";
import { useBooleanState } from "@react-hooks";
import {
  patchProfiles,
  useGetWallets,
  useInvokeByeWorld,
  useInvokeHelloWorld,
} from "@react-query-sdk";
import { supabase } from "@react-auth-client";
import { Avatar, VisionCamera } from "@organisms";
import { useGetLoggedUserProfile } from "@hooks";
import { getQueryFilters, showAlert, uploadImage } from "@utils";
import { BUCKET_NAME } from "@constants";
import { ActivityIndicator } from "react-native";
import { Trans } from "@lingui/react/macro";
import { PhotoFile } from "react-native-vision-camera";
import { ImageBackground } from "expo-image";
import * as FileSystem from "expo-file-system";

const StyledImageBackground = styled(ImageBackground, {
  style: {
    width: "100%",
    height: "100%",
  },
});

const profilePhotoFileName = "profile-photo";

const ProfileScreen = () => {
  const {
    firstName,
    lastName,
    email,
    id: userId,
    profilePhotoUrl,
  } = useGetLoggedUserProfile() ?? {};
  const handleLogout = useAuthStore((state) => state.handleLogout);
  const { state: isLoading, toggleState: toggleIsLoading } =
    useBooleanState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [key, setKey] = useState(0); // to force re-rendering the Image component
  const lastUploadedPhoto = useRef(null);
  const { data, error } = useGetWallets(
    getQueryFilters({
      user_id: userId,
    }),
  );

  const { mutateAsync, isPending: isPendingHello } = useInvokeHelloWorld();
  const { mutateAsync: byeWorld, isPending: isPendingBye } =
    useInvokeByeWorld();

  console.log("useGetWallets", data, "Error:", error);
  console.log("isPendingHello", isPendingHello);
  console.log("isPendingBye", isPendingBye);

  const destinationPath = `${userId}/${profilePhotoFileName}`;

  useEffect(() => {
    lastUploadedPhoto.current = profilePhotoUrl;
  }, [profilePhotoUrl]);

  useEffect(() => {
    const helloFunc = async () => {
      const response = await mutateAsync({ data: { name: "Mariano@@YYYYY" } });
      console.log("response", response);
    };

    const byeFunc = async () => {
      const response = await byeWorld({ data: { name: "Mariano" } });
      console.log("response", response);
    };

    helloFunc();
    byeFunc();
  }, [mutateAsync, byeWorld]);

  useEffect(() => {
    setAvatarUrl(profilePhotoUrl);
  }, [profilePhotoUrl]);

  const handleTakePhoto = async (photo: PhotoFile) => {
    try {
      const photoData = new FileSystem.File("file:///" + photo.path);
      const data = await uploadImage(
        photo.path,
        await photoData.arrayBuffer(),
        "image/jpeg",
        destinationPath,
      );
      await updateProfile(data.path);
    } catch (e) {
      console.error("Error uploading photo:", e);
      showAlert({ title: e.message, preset: "error" });
    }
    setShowCamera(false);
  };

  const handleOnPressLogout = async () => {
    try {
      toggleIsLoading();
      await supabase.auth.signOut();
      handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      toggleIsLoading();
    }
  };

  const updateProfile = async (url: string) => {
    try {
      await patchProfiles(
        { photo_url: url, user_id: userId },
        getQueryFilters({ user_id: userId }),
      );
      if (lastUploadedPhoto.current && lastUploadedPhoto.current !== url) {
        // extension changed
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([lastUploadedPhoto.current]);
      }
      lastUploadedPhoto.current = url;
      setKey((prev) => prev + 1);
    } catch (e) {
      showAlert(e.message);
    }
  };

  return !isPendingHello && !isPendingBye ? (
    <Containers.Screen>
      <StyledImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop",
        }}
      >
        <BodyRegularSm>{"Email"}</BodyRegularSm>
        <Spacer size={"$md"} />
        <BaseTextInput value={email} disabled />
        <Spacer size={"$button-md"} />
        <BodyRegularSm>
          <Trans>{"Full name"}</Trans>
        </BodyRegularSm>
        <Spacer size={"$md"} />
        <BaseTextInput value={firstName + " " + lastName} />

        <Spacer size={"$button-md"} />

        <Avatar
          customKey={key}
          size={200}
          url={avatarUrl}
          destinationPath={destinationPath}
          onUpload={(url: string) => {
            setAvatarUrl(() => {
              updateProfile(url);
              return url;
            });
          }}
          onError={(message) => {
            showAlert({ title: message, preset: "error" });
          }}
        />

        <Spacer size={"$button-md"} />

        <SubmitButton
          onPress={() => {
            setShowCamera(true);
          }}
          loading={isLoading}
        >
          <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
            <Trans>{"Take Photo"}</Trans>
          </LabelSemiboldLg>
        </SubmitButton>
        <Containers.SubGlassY
          style={{ width: "100%" }}
          isInteractive
          height={50}
        >
          <Spacer size={"$button-md"} />
        </Containers.SubGlassY>

        <SubmitButton onPress={handleOnPressLogout} loading={isLoading}>
          <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
            <Trans>{"Sign Out"}</Trans>
          </LabelSemiboldLg>
        </SubmitButton>
      </StyledImageBackground>
      {showCamera ? (
        <VisionCamera
          onTakePhoto={handleTakePhoto}
          onClose={() => setShowCamera(false)}
        />
      ) : null}
    </Containers.Screen>
  ) : (
    <ActivityIndicator size={"small"} />
  );
};

export { ProfileScreen };
