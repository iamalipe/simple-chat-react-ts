export interface ConversationInterface extends Realm.Services.MongoDB.Document {
  _id: string;
  createdAt: Date;
  modifyAt: Date;
  users: string[];
  lastMessage: string;
  lastMessageId: string;
  lastMessageTime: Date;
  newMessageCount: number;
}
