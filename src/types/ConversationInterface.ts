import { createObjectId } from "./../utils/realmUtilsFunctions";

export enum CallSessionsModeEnum {
  "CALLING" = "CALLING",
  "ACCEPTING" = "ACCEPTING",
  "ACCEPTED" = "ACCEPTED",
  "REJECT" = "REJECT",
}
export interface ConversationInterface extends Realm.Services.MongoDB.Document {
  _id: string | ReturnType<typeof createObjectId>;
  createdAt: Date;
  modifyAt: Date;
  users: string[];
  lastMessage?: string;
  lastMessageId?: string;
  lastMessageTime?: Date;
  isThereNewMessage: boolean;
  callSessions?: ConversationCallSessionsInterface;
}

export interface ConversationCallSessionsInterface {
  callerId: string;
  _id: string;
  isCall: boolean;
  rtcOffer: string;
  rtcAns?: string;
  rtcNego?: string;
  mode: CallSessionsModeEnum;
}