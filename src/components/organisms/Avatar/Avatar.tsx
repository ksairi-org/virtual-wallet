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
};

const Avatar = ({
  url,
  destinationPath,
  size = 150,
  onUpload,
  onError,
}: AvatarProps) => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [key, setKey] = useState(0); // to force re-rendering the Image component
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    const downloadImage = async (path: string) => {
      console.log(path);
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .download(path + "?" + key);

        if (error) {
          throw error;
        }

        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setAvatarUrl(fr.result as string);
          setLoading(false);
        };
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    };

    if (url) {
      downloadImage(url);
    }
  }, [key, url]);

  const uploadAvatar = async () => {
    try {
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

      setLoading(true);

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );
      const data = await uploadImage(
        image.uri,
        arraybuffer,
        image.mimeType ?? "image/jpeg",
        destinationPath,
      );
      setKey((prevKey) => prevKey + 1); // Force re-render the Image component
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
      <Image source={{ uri: avatarUrl }} style={avatarSize} objectFit="cover" />
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
