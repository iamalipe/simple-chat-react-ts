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
  callSessions?: ConversationCallSessionsInterface;
}

export interface ConversationCallSessionsInterface {
  callStart: Date;
  messageRefId: string;
  isCall: boolean;
  from: string;
  mode:
    | "CALLING"
    | "ACCEPTING"
    | "ACCEPTED"
    | "REJECT"
    | "NEGOTIATION"
    | "NEGOTIATION_ANSWER"
    | "CONNECTED";
  rtcOffer: string;
  rtcAnswer?: string;
  rtcNegotiation?: string;
  rtcNegotiationAnswer?: string;
}