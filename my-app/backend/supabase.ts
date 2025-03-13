import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (fileUri, bucketName, filePath) => {
  try {
    const fileType = fileUri.split(".").pop();

    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileBuffer = new Uint8Array(
      atob(fileData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: `image/${fileType}`,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    console.warn("Upload concluído. URL pública:", publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (error) {
    console.warn("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};
