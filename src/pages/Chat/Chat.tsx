/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import data from "./data.json";
import { useState } from "react";
import { ChatMessage, ChatMessageSelf } from ".";
import { Navigate, useLocation } from "react-router-dom";
import { RouteNames } from "../../types";
import {
  ChatMessageSkeleton,
  ChatMessageSkeletonSelf,
} from "./ChatMessageSkeleton";

export interface ChatInterface {
  id: {
    $oid: string;
  };
  conversationId: string;
  senderId: string;
  message: string;
  isImage: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  isSeen: {
    userId: string;
    time: string;
  }[];
}

export interface ChatMessagesGroupInterface {
  conversationId: string;
  senderId: string;
  messages: ChatInterface[];
}

const chatData = data as unknown as ChatInterface[];

const groupChatData = (data: ChatInterface[]) => {
  const formattedData: ChatMessagesGroupInterface[] = [];
  let currentSenderId = "";
  data.forEach((message, index) => {
    if (index === 0) {
      formattedData.push({
        senderId: message.senderId,
        conversationId: message.conversationId,
        messages: [{ ...message }],
      });
      currentSenderId = message.senderId;
    } else {
      if (message.senderId === currentSenderId) {
        // For subsequent messages with the same senderId, add to contents array
        formattedData[formattedData.length - 1].messages.push({
          ...message,
        });
      } else {
        // For messages with a different senderId, create a new entry in formattedData
        formattedData.push({
          senderId: message.senderId,
          conversationId: message.conversationId,
          messages: [{ ...message }],
        });
        currentSenderId = message.senderId;
      }
    }
  });
  return formattedData;
};

export const Chat = () => {
  const location = useLocation();
  const locationState = location.state;

  const newData = groupChatData(chatData);
  const myId = "64c92f0efc13ae533baf11e9";
  const [value, setValue] = useState("");

  const onValueChange = (text: string) => {
    setValue(text);
    const textarea = document.getElementById("input-textarea");
    if (!textarea) return;
    const heightLimit = 200; /* Maximum height: 200px */
    textarea.style.height = ""; /* Reset the height*/
    textarea.style.height = `${
      Math.min(textarea.scrollHeight, heightLimit) - 4
    }px`;
  };

  if (!locationState) return <Navigate to={RouteNames.HOME} />;
  return (
    <div className="flex-1 w-full bg-base-100 flex flex-col">
      <div className="flex-none bg-base-200 h-12 flex items-center px-12 sm:px-6">
        <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
          {locationState}
        </h1>
        {/* <input
          type="text"
          placeholder="Search..."
          className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 new-chat-toggle-target transition-all duration-1000 mr-0"
        /> */}
      </div>
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
      {/* <div className="p-2 sm:p-5 flex-1 overflow-auto flex flex-col gap-2">
        {newData.map((e, index) =>
          e.senderId === myId ? (
            <ChatMessageSelf
              key={index}
              messages={e.messages}
              username={e.senderId}
            />
          ) : (
            <ChatMessage
              key={index}
              messages={e.messages}
              username={e.senderId}
            />
          )
        )}
      </div> */}
      <div className="flex-none bg-base-200 flex flex-col px-2 sm:px-6">
        <div className="flex flex-col max-h-48">
          <textarea
            // id="input-textarea"
            placeholder="Type a message..."
            className="border-none outline-none w-full px-2 resize-none min-h-[2rem] mt-2 bg-transparent text-base-content text-base overflow-auto"
            value={value}
            rows={1}
            onChange={(e) => onValueChange(e.target.value)}
          ></textarea>
        </div>
        <div className="h-10 flex items-center border-t border-t-base-content/25 gap-2 px-1">
          <button className="daisy-btn daisy-btn-xs daisy-btn-neutral">
            Image
          </button>
          <button className="daisy-btn daisy-btn-xs daisy-btn-neutral ml-auto">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
