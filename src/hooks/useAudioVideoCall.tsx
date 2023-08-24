import { useCallback, useState } from "react";
import peerService from "../services/peerService";
import { useCollection, useRealm } from ".";
import {
  CallSessionsModeEnum,
  ConversationCallSessionsInterface,
  ConversationInterface,
  MessageInterface,
} from "../types";
import { createObjectId } from "../utils";
import {
  callAtom,
  callLoadingAtom,
  callModalAtom,
  currentConversationIdAtom,
} from "../state";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export const useAudioVideoCall = () => {
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState();
  const [mediaStreamConfig, setMediaStreamConfig] = useState({
    audio: true,
    video: true,
  });

  const currentConversationId = useAtomValue(currentConversationIdAtom);
  const [callState, setCallState] = useAtom(callAtom);
  const setCallModalState = useSetAtom(callModalAtom);
  const { currentUser } = useRealm();
  const [loading, setLoading] = useAtom(callLoadingAtom);

  const messagesCollection = useCollection("chatApp", "messages");
  const conversationsCollection = useCollection("chatApp", "conversations");
  // console.log("Calling loading", loading);
  const connectCall = async () => {
    if (!currentConversationId) return;
    if (!messagesCollection) return;
    if (!currentUser) return;
    try {
      console.log("Calling");
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaStreamConfig
      );
      const rtcSession = await peerService.getOffer();
      const offerString = JSON.stringify(rtcSession);
      const newMessage: MessageInterface = {
        _id: createObjectId(),
        senderId: currentUser.id,
        createdAt: new Date(),
        modifyAt: new Date(),
        conversationId: currentConversationId,
        message: "connect call",
        isSeen: false,
        files: [],
      };
      const newData: ConversationCallSessionsInterface = {
        _id: newMessage._id.toString(),
        callerId: currentUser.id,
        isCall: true,
        mode: CallSessionsModeEnum.CALLING,
        rtcOffer: offerString,
      };

      await conversationsCollection?.updateOne(
        { _id: { $oid: currentConversationId } },
        {
          $set: {
            callSessions: newData,
            modifyAt: new Date(),
          },
        }
      );

      await messagesCollection.insertOne(newMessage);
      setCallState((prev) => ({
        ...prev,
        callId: newMessage._id.toString(),
        myStream: stream,
        from: currentUser.id,
        conversationId: currentConversationId,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectCall = async () => {
    if (!messagesCollection) return;
    try {
      await messagesCollection.updateOne(
        { _id: { $oid: callState.callId } },
        {
          $set: {
            message: "call disconnected",
            modifyAt: new Date(),
          },
        }
      );

      await conversationsCollection?.updateOne(
        { _id: { $oid: callState.conversationId } },
        {
          $set: {
            callSessions: {
              isCall: false,
            },
            modifyAt: new Date(),
          },
        }
      );

      callState.myStream?.getTracks().forEach((track) => track.stop());
      callState.otherStream?.getTracks().forEach((track) => track.stop());
      setCallState({});
      setCallModalState(false);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptIncomingCall = async (data: {
    from: string;
    offer: RTCSessionDescription;
    callId: string;
  }) => {
    if (loading) return;
    setLoading(true);
    if (!messagesCollection) return;
    try {
      const { from, callId, offer } = data;
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaStreamConfig
      );
      const rtcAns = await peerService.getAnswer(offer);
      await messagesCollection.updateOne(
        { _id: { $oid: callId } },
        {
          $set: {
            message: "call accepting",
            callSessions: {
              rtcAns: JSON.stringify(rtcAns),
              mode: CallSessionsModeEnum.ACCEPTING,
            },
            modifyAt: new Date(),
          },
        }
      );

      console.log(`Incoming Call`, from, offer, rtcAns);
      setCallState((prev) => ({
        ...prev,
        callId: callId,
        myStream: stream,
        from: from,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const callAccepted = async (data: { ans: RTCSessionDescription }) => {
    if (loading) return;
    setLoading(true);
    const { ans } = data;
    if (!messagesCollection) return;
    if (!callState.myStream) return;
    try {
      peerService.setLocalDescription(ans);
      console.log("Call Accepted!", ans);
      await messagesCollection.updateOne(
        { _id: { $oid: callState.callId } },
        {
          $set: {
            message: "call accepted",
            callSessions: {
              mode: CallSessionsModeEnum.ACCEPTED,
            },
            modifyAt: new Date(),
          },
        }
      );
      for (const track of callState.myStream.getTracks()) {
        if (!peerService.peer) return;
        peerService.peer.addTrack(track, callState.myStream);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peerService.getOffer();
    // socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteId]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }: { from: string; offer: RTCSessionDescription }) => {
      const ans = await peerService.getAnswer(offer);
      // socket.emit("peer:nego:done", { to: from, ans });
    },
    []
  );

  const handleNegoNeedFinal = useCallback(
    async ({ ans }: { ans: RTCSessionDescription }) => {
      await peerService.setLocalDescription(ans);
    },
    []
  );

  return {
    connectCall,
    disconnectCall,
    acceptIncomingCall,
    callAccepted,
  };
};
