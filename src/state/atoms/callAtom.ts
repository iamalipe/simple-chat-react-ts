import { atom } from "jotai";
import { ConversationCallSessionsInterface, UserInterface } from "../../types";

export interface CallAtomInterface {
  conversationId: string;
  otherUser: UserInterface;
  isIamCalling: boolean;
  myStream?: MediaStream;
  remoteStream?: MediaStream;
}

export const callAtom = atom<CallAtomInterface | null>(null);
export const callSessionsAtom = atom<ConversationCallSessionsInterface | null>(
  null
);