import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { ConversationInterface } from "../../types";

export const conversationsAtom = atom<ConversationInterface[]>([]);
export const conversationsLoadingAtom = atom(false);
export const currentConversationIdAtom = atomWithStorage<string | null>(
  "currentConversationId",
  null
);
