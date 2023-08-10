import { createObjectId } from "./../utils/realmUtilsFunctions";
export interface ConversationInterface extends Realm.Services.MongoDB.Document {
  _id: string | ReturnType<typeof createObjectId>;
  createdAt: Date;
  modifyAt: Date;
  users: string[];
  lastMessage?: string;
  lastMessageId?: string;
  lastMessageTime?: Date;
  isThereNewMessage: boolean;
}
