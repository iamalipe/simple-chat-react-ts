import { useCallback, useState } from "react";
import peerService from "../services/peerService";
import { useCollection, useRealm } from ".";
import { CallSessionsModeEnum, MessageInterface } from "../types";
import { createObjectId } from "../utils";
import { callAtom, callLoadingAtom, callModalAtom } from "../state";
import { useAtom, useSetAtom } from "jotai";

export const useAudioVideoCall = () => {
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState();
  const [mediaStreamConfig, setMediaStreamConfig] = useState({
    audio: true,
    video: true,
  });

  const [callState, setCallState] = useAtom(callAtom);
  const setCallModalState = useSetAtom(callModalAtom);
  const { currentUser } = useRealm();
  const [loading, setLoading] = useAtom(callLoadingAtom);

  const messagesCollection = useCollection("chatApp", "messages");
  const conversationsCollection = useCollection("chatApp", "conversations");
  console.log("Calling loading", loading);
  const connectCall = async (conversationId: string) => {
    if (loading) return;
    setLoading(true);
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
        conversationId: conversationId,
        message: "connect call",
        isSeen: false,
        files: [],
        callSessions: {
          isCall: true,
          rtcInfo: offerString,
          mode: CallSessionsModeEnum.CALLING,
        },
      };
      await messagesCollection.insertOne(newMessage);
      setCallState((prev) => ({
        ...prev,
        callId: newMessage._id.toString(),
        myStream: stream,
        from: currentUser.id,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectCall = async () => {
    if (loading) return;
    setLoading(true);
    if (!messagesCollection) return;
    try {
      await messagesCollection.updateOne(
        { _id: { $oid: callState.callId } },
        {
          $set: {
            message: "call disconnected",
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
    } finally {
      setLoading(false);
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
