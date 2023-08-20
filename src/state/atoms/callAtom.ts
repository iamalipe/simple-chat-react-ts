import { atom } from "jotai";
import { CallSessionsModeEnum } from "../../types";

export interface CallAtomInterface {
  callId?: string;
  myStream?: MediaStream;
  otherStream?: MediaStream;
  from?: string;
  conversationId?: string;
  offer?: RTCSessionDescription;
  ans?: RTCSessionDescription;
  rtcMode?: CallSessionsModeEnum;
  mode?: "INCOMING" | "OUTGOING";
}

export const callAtom = atom<CallAtomInterface>({});

export const callModalAtom = atom(false);

export const callLoadingAtom = atom(false);
