import { ImageKitFileInterface } from ".";
import { createObjectId } from "../utils/realmUtilsFunctions";


export enum CallSessionsModeEnum {
  "CALLING" = "CALLING",
  "ACCEPTING" = "ACCEPTING",
  "ACCEPTED" = "ACCEPTED",
  "REJECT" = "REJECT",
}
export interface MessageInterface extends Realm.Services.MongoDB.Document {
  _id: string | ReturnType<typeof createObjectId>;
  createdAt: Date;
  modifyAt: Date;
  conversationId: string;
  message: string;
  senderId: string;
  isSeen: boolean;
  files: ImageKitFileInterface[];
  callSessions?: {
    isCall: boolean;
    rtcInfo: string;
    rtcAns?: string;
    rtcNego?: string;
    mode?: CallSessionsModeEnum;
  };
}

export interface MessagesGroupInterface {
  conversationId: string;
  senderId: string;
  messages: MessageInterface[];
}
