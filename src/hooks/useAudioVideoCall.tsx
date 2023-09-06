import { useState, useEffect, useCallback } from "react";
import peerService from "../services/peerService";
import { useCollection, useRealm } from ".";
import { ConversationCallSessionsInterface, MessageInterface } from "../types";
import { createObjectId, toast } from "../utils";
import {
  callAtom,
  callSessionsAtom,
  currentConversationIdAtom,
} from "../state";
import { useAtom, useAtomValue } from "jotai";

export const useAudioVideoCall = () => {
  const [mediaStreamConfig, setMediaStreamConfig] = useState({
    audio: true,
    video: true,
  });

  const currentConversationId = useAtomValue(currentConversationIdAtom);
  const [callState, setCallState] = useAtom(callAtom);
  const [callSessionsState, setCallSessionsState] = useAtom(callSessionsAtom);
  const { currentUser } = useRealm();

  const messagesCollection = useCollection("chatApp", "messages");
  const conversationsCollection = useCollection("chatApp", "conversations");

  useEffect(() => {
    if (!peerService.peer) return;
    peerService.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setCallState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          remoteStream: remoteStream[0],
        };
      });
    });
  }, [setCallState]);

  const connectCall = async () => {
    if (!callState) return;
    if (!currentConversationId) return;
    if (!messagesCollection) return;
    if (!currentUser) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaStreamConfig
      );
      const rtcSession = await peerService.getOffer();
      const offerString = JSON.stringify(rtcSession);
      const callStart = new Date();
      const newMessage: MessageInterface = {
        _id: createObjectId(),
        senderId: currentUser.id,
        createdAt: new Date(),
        modifyAt: new Date(),
        conversationId: currentConversationId,
        message: "CALLING",
        isDelete: false,
        isDisplay: false,
        type: "CALL",
        isSeen: false,
        files: [],
        callStart: callStart,
        callEnd: callStart,
      };
      const newData: ConversationCallSessionsInterface = {
        messageRefId: newMessage._id.toString(),
        from: currentUser.id,
        isCall: true,
        mode: "CALLING",
        rtcOffer: offerString,
        callStart: callStart,
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
      const newState = { ...callState };
      newState.myStream = stream;
      setCallState(newState);
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const disconnectCall = async () => {
    if (!messagesCollection) return;
    if (!callSessionsState) return;
    if (!callState) return;
    try {
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState?.messageRefId } },
        {
          $set: {
            isDisplay: true,
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
      callState.remoteStream?.getTracks().forEach((track) => track.stop());
      setCallState(null);
      setCallSessionsState(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const callEnd = async () => {
    if (!messagesCollection) return;
    if (!callSessionsState) return;
    if (!callState) return;
    try {
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            isDisplay: true,
            message: "call end",
            callEnd: new Date(),
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
      callState.remoteStream?.getTracks().forEach((track) => track.stop());
      setCallState(null);
      setCallSessionsState(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const callReject = async () => {
    if (!messagesCollection) return;
    if (!callState) return;
    if (!callSessionsState) return;
    try {
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            message: "call rejected",
            isDisplay: true,
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
      callState.remoteStream?.getTracks().forEach((track) => track.stop());
      setCallState(null);
      setCallSessionsState(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const acceptIncomingCall = async () => {
    if (!callState) return;
    if (!callSessionsState) return;
    if (!messagesCollection) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaStreamConfig
      );
      const rtcOffer = JSON.parse(callSessionsState.rtcOffer);
      const rtcAnswer = await peerService.getAnswer(rtcOffer);
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            message: "ACCEPTING",
            modifyAt: new Date(),
          },
        }
      );
      const newData: ConversationCallSessionsInterface = {
        ...callSessionsState,
        rtcAnswer: JSON.stringify(rtcAnswer),
        mode: "ACCEPTING",
      };

      await conversationsCollection?.updateOne(
        { _id: { $oid: callState.conversationId } },
        {
          $set: {
            callSessions: newData,
            modifyAt: new Date(),
          },
        }
      );

      const newState = { ...callState };
      newState.myStream = stream;
      setCallState(newState);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const callAccepted = async () => {
    if (!callState) return;
    if (!callSessionsState) return;
    if (!callState.myStream) return;
    if (!messagesCollection) return;
    try {
      const rtcAnswer = JSON.parse(callSessionsState.rtcAnswer || "");
      await peerService.setLocalDescription(rtcAnswer);
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            message: "ACCEPTED",
            modifyAt: new Date(),
          },
        }
      );
      const newData: ConversationCallSessionsInterface = {
        ...callSessionsState,
        mode: "ACCEPTED",
      };
      await conversationsCollection?.updateOne(
        { _id: { $oid: callState.conversationId } },
        {
          $set: {
            callSessions: newData,
            modifyAt: new Date(),
          },
        }
      );
      sendStream();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const sendNegotiation = useCallback(async () => {
    if (!callState) return;
    if (!callSessionsState) return;
    if (!callState.myStream) return;
    if (!messagesCollection) return;
    try {
      const rtcNegotiation = await peerService.getOffer();
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            message: "NEGOTIATION",
            modifyAt: new Date(),
          },
        }
      );
      const newData: ConversationCallSessionsInterface = {
        ...callSessionsState,
        mode: "NEGOTIATION",
        rtcNegotiation: JSON.stringify(rtcNegotiation),
      };
      await conversationsCollection?.updateOne(
        { _id: { $oid: callState.conversationId } },
        {
          $set: {
            callSessions: newData,
            modifyAt: new Date(),
          },
        }
      );
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  }, [
    callSessionsState,
    callState,
    conversationsCollection,
    messagesCollection,
    setCallSessionsState,
    setCallState,
  ]);

  const negotiationAnswer = async () => {
    if (!callState) return;
    if (!callSessionsState) return;
    if (!callState.myStream) return;
    if (!messagesCollection) return;
    try {
      const rtcNegotiation = JSON.parse(callSessionsState.rtcNegotiation || "");
      const rtcNegotiationAnswer = await peerService.getAnswer(rtcNegotiation);
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            message: "NEGOTIATION_ANSWER",
            modifyAt: new Date(),
          },
        }
      );
      const newData: ConversationCallSessionsInterface = {
        ...callSessionsState,
        mode: "NEGOTIATION_ANSWER",
        rtcNegotiationAnswer: JSON.stringify(rtcNegotiationAnswer),
      };
      await conversationsCollection?.updateOne(
        { _id: { $oid: callState.conversationId } },
        {
          $set: {
            callSessions: newData,
            modifyAt: new Date(),
          },
        }
      );
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const negotiationFinal = async () => {
    if (!callState) return;
    if (!callSessionsState) return;
    if (!callState.myStream) return;
    if (!messagesCollection) return;
    try {
      const rtcNegotiationAnswer = JSON.parse(
        callSessionsState.rtcNegotiationAnswer || ""
      );
      await peerService.setLocalDescription(rtcNegotiationAnswer);
      await messagesCollection.updateOne(
        { _id: { $oid: callSessionsState.messageRefId } },
        {
          $set: {
            message: "CONNECTED",
            modifyAt: new Date(),
          },
        }
      );
      const newData: ConversationCallSessionsInterface = {
        ...callSessionsState,
        mode: "CONNECTED",
      };
      await conversationsCollection?.updateOne(
        { _id: { $oid: callState.conversationId } },
        {
          $set: {
            callSessions: newData,
            modifyAt: new Date(),
          },
        }
      );
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorMessage = err.message;
      toast(errorMessage);
      console.error(err);
      setCallState(null);
      setCallSessionsState(null);
    }
  };

  const sendStream = () => {
    if (!callState) return;
    if (!callState.myStream) return;
    for (const track of callState.myStream.getTracks()) {
      if (!peerService.peer) return;
      peerService.peer.addTrack(track, callState.myStream);
    }
  };

  useEffect(() => {
    peerService?.peer?.addEventListener("negotiationneeded", sendNegotiation);
    return () => {
      peerService?.peer?.removeEventListener(
        "negotiationneeded",
        sendNegotiation
      );
    };
  }, [sendNegotiation]);

  return {
    connectCall,
    disconnectCall,
    callReject,
    acceptIncomingCall,
    callAccepted,
    sendNegotiation,
    negotiationAnswer,
    negotiationFinal,
    callEnd,
    sendStream,
  };
};
