import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@react-auth-client";
import { Containers } from "@ui-containers";
import { Image } from "@expo-image";
import { CtaButton } from "@molecules";
import { BodyRegularMd } from "@fonts";
import { showAlert } from "@utils";
import { BUCKET_NAME } from "@constants";

type AvatarProps = {
  size: number;
  url: string | null;
  destinationPath: string;
  onUpload: (filePath: string) => void;
};

const Avatar = ({
  url,
  destinationPath,
  size = 150,
  onUpload,
}: AvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [key, setKey] = useState(0); // to force re-rendering the Image component
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    const downloadImage = async (path: string) => {
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
          setUploading(false);
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
      setUploading(true);

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

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${destinationPath}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
          upsert: true, // be able to overwrite the image
        });

      if (uploadError) {
        console.error("Error uploading image: ", uploadError);
        throw uploadError;
      }
      setKey((prevKey) => prevKey + 1); // Force re-render the Image component
      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        showAlert({ title: error.message, preset: "error" });
      } else {
        throw error;
      }
    }
  };

  return (
    <Containers.SubY>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={avatarSize}
          objectFit="cover"
        />
      ) : (
        <Containers.SubY
          backgroundColor={"$background-body"}
          borderWidth={"$button-sm"}
          borderStyle={"solid"}
          borderColor={"$background-secondary"}
          borderRadius={"$2xl"}
          overflow="hidden"
        />
      )}
      <Containers.SubY>
        <CtaButton
          onPress={uploadAvatar}
          disabled={uploading}
          loading={uploading}
        >
          <BodyRegularMd>{"Upload"}</BodyRegularMd>
        </CtaButton>
      </Containers.SubY>
    </Containers.SubY>
  );
};

export { Avatar };
