import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useLayoutEffect } from "react";
import { ChatHeader, ChatInput, ChatMessage, ChatMessageSelf } from ".";
import { Navigate, useLocation } from "react-router-dom";
import { RouteNames } from "../../types";
import {
  ChatMessageSkeleton,
  ChatMessageSkeletonSelf,
} from "./ChatMessageSkeleton";
import { useConversations, useMessages, useRealm } from "../../hooks";
import { groupMessagesData } from "../../utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  callAtom,
  conversationsLoadingAtom,
  currentConversationIdAtom,
  messagesAtom,
  messagesLoadingAtom,
} from "../../state";

export const Chat = () => {
  const location = useLocation();
  const locationState = location.state;

  const { currentUser } = useRealm();
  const messagesAtomState = useAtomValue(messagesAtom);
  const messagesLoadingState = useAtomValue(messagesLoadingAtom);
  const conversationsLoadingState = useAtomValue(conversationsLoadingAtom);
  const setCallState = useSetAtom(callAtom);
  const [currentConversationId, setCurrentConversationId] = useAtom(
    currentConversationIdAtom
  );

  const { createConversation } = useConversations();
  const messages = useMessages();
  const messagesState = groupMessagesData(messagesAtomState);

  useLayoutEffect(() => {
    if (!locationState) return;
    if (location.state.userId) {
      createConversation(location.state.userId).then((conversationId) => {
        setCurrentConversationId(conversationId || "");
      });
    }

    if (location.state.conversationId) {
      setCurrentConversationId(location.state.conversationId);
    }
  }, [
    createConversation,
    location.state.conversationId,
    location.state.userId,
    locationState,
    setCurrentConversationId,
  ]);

  const onSendMessage = async (value: string, fileArray?: File[]) => {
    await messages.sendMessage(value, fileArray);
  };

  const onVideoCall = () => {
    if (!currentConversationId) return;
    setCallState({
      otherUser: locationState.otherUserInfo,
      isIamCalling: true,
      conversationId: currentConversationId,
    });
  };

  if (!currentConversationId) return <Navigate to={RouteNames.HOME} />;
  return (
    <div className="flex-1 w-full bg-base-100 flex flex-col">
      <div className="flex-none bg-base-200 h-12 flex items-center pl-12 pr-2 sm:px-6">
        <ChatHeader title={locationState.title} onVideoCall={onVideoCall} />
        {/* <input
          type="text"
          placeholder="Search..."
          className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 new-chat-toggle-target transition-all duration-1000 mr-0"
        /> */}
      </div>
      {messagesLoadingState || conversationsLoadingState ? (
        <ChatLoadingSkeletons />
      ) : (
        <div className="p-2 sm:p-5 flex-1 overflow-auto flex flex-col-reverse gap-2">
          {messagesState
            .reverse()
            .map((e, index) =>
              e.senderId === currentUser?.id ? (
                <ChatMessageSelf key={index} messages={e.messages} />
              ) : (
                <ChatMessage
                  key={index}
                  messages={e.messages}
                  username={locationState.title as string}
                />
              )
            )}
        </div>
      )}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

const ChatLoadingSkeletons = () => {

  return (
    <div className="p-2 sm:p-5 flex-1 overflow-auto flex flex-col-reverse gap-2">
      <ChatMessageSkeletonSelf />
      <ChatMessageSkeletonSelf />
      <ChatMessageSkeleton />
      <ChatMessageSkeletonSelf />
      <ChatMessageSkeleton />
      <ChatMessageSkeletonSelf />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton />
    </div>
  );
};