import { useEffect, useRef, useState } from "react";
import { Containers } from "@ui-containers";
import { Spacer } from "tamagui";
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
import { getQueryFilters, showAlert } from "@utils";
import { BUCKET_NAME } from "@constants";
import { ActivityIndicator } from "react-native";
import { Trans } from "@lingui/react/macro";
import { PhotoFile } from "react-native-vision-camera";

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
  const lastUploadedPhoto = useRef(profilePhotoUrl);
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
    console.log(photo);
    // The photo has been taken, now you can upload it to Supabase Storage
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
    } catch (e) {
      showAlert(e.message);
    }
  };
  if (showCamera) {
    return (
      <VisionCamera
        onTakePhoto={handleTakePhoto}
        onClose={() => setShowCamera(false)}
      />
    );
  }
  return !isPendingHello && !isPendingBye ? (
    <Containers.ScreenGlass>
      <Containers.SubGlassY>
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
          size={200}
          url={avatarUrl}
          destinationPath={`${userId}/${profilePhotoFileName}`}
          onUpload={(url: string) => {
            setAvatarUrl(() => {
              updateProfile(url);
              return url;
            });
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

        <Spacer size={"$button-md"} />

        <SubmitButton onPress={handleOnPressLogout} loading={isLoading}>
          <LabelSemiboldLg textAlign={"center"} color={"$text-action-inverse"}>
            <Trans>{"Sign Out"}</Trans>
          </LabelSemiboldLg>
        </SubmitButton>
      </Containers.SubGlassY>
    </Containers.ScreenGlass>
  ) : (
    <ActivityIndicator size={"small"} />
  );
};

export { ProfileScreen };
