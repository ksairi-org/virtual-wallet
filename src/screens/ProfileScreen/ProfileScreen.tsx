import { useEffect, useRef, useState } from "react";
import { Containers } from "@ui-containers";
import { Spacer, styled } from "tamagui";
import { CTAButton, PrimaryButton } from "@molecules";
import { BodyBoldMd, BodyRegularSm, LabelSemiboldLg } from "@fonts";
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
import { Trans, useLingui } from "@lingui/react/macro";
import { PhotoFile } from "react-native-vision-camera";
import { ImageBackground } from "expo-image";
import * as FileSystem from "expo-file-system";
import { HomeStackNavigatorScreenProps } from "@navigation/types";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  ZoomInLeft,
  ZoomInRight,
  ZoomInRotate,
} from "react-native-reanimated";

const StyledImageBackground = styled(ImageBackground, {
  style: {
    width: "100%",
    height: "100%",
  },
});

const StyledAnimatedSignOutView = styled(Animated.View, {
  flexDirection: "column",
  flex: 1,
  justifyContent: "flex-end",
  marginBottom: "$lg",
});

const profilePhotoFileName = "profile-photo";

const ProfileScreen = ({
  navigation,
}: HomeStackNavigatorScreenProps<"ProfileScreen">) => {
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
  const [upLoading, setUpLoading] = useState(false);
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

  const { t } = useLingui();

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

  const showGallery = async () => {
    try {
      setUpLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      if (!image.uri) {
        throw new Error("No image uri!");
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );
      const data = await uploadImage(
        image.uri,
        arraybuffer,
        image.mimeType ?? "image/jpeg",
        destinationPath,
      );
      setAvatarUrl(() => {
        updateProfile(data.path);
        return data.path;
      });
    } catch (error) {
      if (error instanceof Error) {
        showAlert({ title: error.message, preset: "error" });
      } else {
        showAlert({
          title: error?.message ?? "Unknown error",
          preset: "error",
        });
      }
    } finally {
      setUpLoading(false);
    }
  };

  return !isPendingHello && !isPendingBye ? (
    <Containers.Screen>
      <StyledImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop",
        }}
      >
        <Containers.SubGlassY
          isInteractive
          flex={1}
          paddingHorizontal={"$md"}
          paddingTop={"$md"}
        >
          <Containers.SubY alignItems="center">
            <Animated.View entering={ZoomInRotate.duration(1100)}>
              <BodyRegularSm>{"Email"}</BodyRegularSm>
              <Spacer size={"$sm"} />
              <BodyBoldMd>{email}</BodyBoldMd>
              <Spacer size={"$md"} />
              <BodyRegularSm>
                <Trans>{"Full name"}</Trans>
              </BodyRegularSm>
              <Spacer size={"$sm"} />
              <BodyBoldMd>{firstName + " " + lastName}</BodyBoldMd>
            </Animated.View>
            <Spacer size={"$lg"} />

            <Animated.View entering={ZoomInRight.duration(1000)}>
              <Avatar
                customKey={key}
                size={200}
                url={avatarUrl}
                onPressOpenCamera={() => setShowCamera(true)}
                onPressShowGallery={showGallery}
                isUpLoading={upLoading}
              />
            </Animated.View>

            <Spacer size={"$lg"} />

            <Animated.View entering={ZoomInRight.duration(1100)}>
              <PrimaryButton
                onPress={() => {
                  navigation.navigate("AIScreen");
                }}
                text={t`AI Assistant`}
              />
            </Animated.View>
          </Containers.SubY>

          <StyledAnimatedSignOutView entering={ZoomInLeft.duration(800)}>
            <CTAButton onPress={handleOnPressLogout} loading={isLoading}>
              <LabelSemiboldLg
                textAlign={"center"}
                color={"$text-action-inverse"}
              >
                <Trans>{"Sign Out"}</Trans>
              </LabelSemiboldLg>
            </CTAButton>
          </StyledAnimatedSignOutView>
        </Containers.SubGlassY>
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
