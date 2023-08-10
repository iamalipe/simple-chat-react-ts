import { createObjectId } from "../utils/realmUtilsFunctions";
export interface MessageInterface extends Realm.Services.MongoDB.Document {
  _id: string | ReturnType<typeof createObjectId>;
  createdAt: Date;
  modifyAt: Date;
  conversationId: string;
  message: string;
  isImage: boolean;
  imageUrl: string;
  senderId: string;
  isSeen: boolean;
}

export interface MessagesGroupInterface {
  conversationId: string;
  senderId: string;
  messages: MessageInterface[];
}
