import { ImageKitFileInterface } from ".";
import { createObjectId } from "../utils/realmUtilsFunctions";

export interface MessageInterface extends Realm.Services.MongoDB.Document {
  _id: string | ReturnType<typeof createObjectId>;
  createdAt: Date;
  modifyAt: Date;
  conversationId: string;
  message: string;
  senderId: string;
  isSeen: boolean;
  type: "MESSAGE" | "CALL";
  isDisplay: boolean;
  isDelete: false;
  files: ImageKitFileInterface[];
  callEnd?: Date;
  callStart?: Date;
}

export interface MessagesGroupInterface {
  conversationId: string;
  senderId: string;
  messages: MessageInterface[];
}
