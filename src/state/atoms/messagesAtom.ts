import { atom } from "jotai";
import { MessageInterface } from "../../types";

export const messagesAtom = atom<MessageInterface[]>([]);
export const messagesLoadingAtom = atom(false);
