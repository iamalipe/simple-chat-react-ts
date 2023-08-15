import axios from "axios";
import { imageKitConfig } from "../config";

const allowedFileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "svg",
  // Videos
  // "mp4",
  // "avi",
  // "mov",
  // "mkv",
  // "wmv",
  // "flv",
  // "webm",
  // Audio
  // "mp3",
  // "wav",
  // "ogg",
  // "aac",
  // "flac",
];

interface ImageUploadApiParameters {
  currentUser: Realm.User<
    Realm.DefaultFunctionsFactory & Realm.BaseFunctionsFactory,
    Realm.DefaultUserProfileData,
    Realm.DefaultUserProfileData
  > | null;
  file: File;
  fileName?: string;
  folder?: string;
  overwriteFile?: boolean;
}

export const imageUploadApi = async (data: ImageUploadApiParameters) => {
  const { currentUser, file, fileName, folder, overwriteFile } = data;

  if (!currentUser) throw new Error("currentUser is null");

  const fileNameSplit = file.name.split(".");
  const fileExtension = fileNameSplit[fileNameSplit.length - 1].toLowerCase();

  if (!allowedFileExtensions.includes(fileExtension)) {
    throw new Error("this type of file not allowed");
  }

  const res = await currentUser.functions.imageKitAuthParameters();

  const payload = new FormData();
  payload.append("file", file);
  payload.append("fileName", `${fileName || currentUser.id}.${fileExtension}`);
  payload.append("signature", res.signature);
  payload.append("publicKey", imageKitConfig.publicKey);
  payload.append("token", res.token);
  payload.append("expire", res.expire);
  payload.append("folder", folder || "default");
  payload.append("overwriteFile", overwriteFile ? "true" : "false");
  payload.append("useUniqueFileName", overwriteFile ? "false" : "true");

  const uploadRes = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    payload
  );
  return uploadRes.data;
};
