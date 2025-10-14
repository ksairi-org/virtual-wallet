import { supabase } from "@react-auth-client";
import { BUCKET_NAME } from "@constants";

const uploadImage = async (
  uri: string,
  imageBody: ArrayBuffer,
  mimeType: string,
  destinationPath: string,
) => {
  const fileExt = uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
  const path = `${destinationPath}.${fileExt}`;
  const { data, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, imageBody, {
      contentType: mimeType ?? "image/jpeg",
      upsert: true, // be able to overwrite the image
    });

  if (uploadError) {
    console.error("Error uploading image: ", uploadError);
    throw uploadError;
  }
  return data;
};

export { uploadImage };
