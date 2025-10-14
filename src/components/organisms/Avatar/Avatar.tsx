import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@react-auth-client";
import { Containers } from "@ui-containers";
import { Image } from "@expo-image";
import { CtaButton } from "@molecules";
import { BodyRegularMd } from "@fonts";
import { uploadImage } from "@utils";
import { BUCKET_NAME } from "@constants";
import { Trans } from "@lingui/react/macro";

type AvatarProps = {
  size: number;
  url: string | null;
  destinationPath: string;
  onUpload: (filePath: string) => void;
  onError?: (message: string) => void;
  customKey: number;
};

const Avatar = ({
  url,
  destinationPath,
  size = 150,
  onUpload,
  onError,
  customKey,
}: AvatarProps) => {
  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    const getImagePublicUrl = async (path: string) => {
      try {
        const { data } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(url, 60 * 60);
        setPublicUrl(data.signedUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    };
    if (url) {
      getImagePublicUrl(url);
    }
  }, [customKey, url]);

  const uploadAvatar = async () => {
    try {
      setLoading(true);
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
      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError(error?.message ?? "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Containers.SubY>
      <Image source={publicUrl} style={avatarSize} objectFit="cover" />
      <Containers.SubY>
        <CtaButton onPress={uploadAvatar} disabled={loading} loading={loading}>
          <BodyRegularMd color={"$text-brand"}>
            <Trans>{"Upload"}</Trans>
          </BodyRegularMd>
        </CtaButton>
      </Containers.SubY>
    </Containers.SubY>
  );
};

export { Avatar };
