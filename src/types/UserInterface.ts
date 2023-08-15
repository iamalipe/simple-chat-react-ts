import { ImageKitFileInterface } from ".";

export interface UserInterface extends Realm.Services.MongoDB.Document {
  _id: string;
  email: string;
  fullName: string | null;
  profileImage: ImageKitFileInterface | null;
  createdAt: Date;
  modifyAt: Date;
}
