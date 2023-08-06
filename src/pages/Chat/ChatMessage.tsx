/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChatInterface, ChatMessageBubble } from ".";
dayjs.extend(relativeTime);

export interface ChatMessageProps {
  messages: ChatInterface[];
  username: string;
}

export const ChatMessageSelf: React.FC<ChatMessageProps> = ({ messages }) => {
  return (
    <div className="flex-none flex max-w-[85%] sm:max-w-[65%] ml-auto">
      <div className="p-2 pt-0 flex flex-col">
        <div className="whitespace-nowrap mr-1 mb-1 gap-2 flex justify-end">
          <span className="text-xs font-normal">
            {dayjs(messages[0].createdAt).fromNow()}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5 text-base-content">
          {messages.map((e, index) => (
            <ChatMessageBubble self data={e} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export const ChatMessage: React.FC<ChatMessageProps> = ({
  messages,
  username,
}) => {
  return (
    <div className="flex-none flex max-w-[85%] sm:max-w-[65%]">
      <div className="daisy-avatar daisy-online flex-none w-12 h-12">
        <div className="w-full rounded-full">
          <img src="https://dummyimage.com/500x500/4166eb/fff.jpg" />
        </div>
      </div>
      <div className="p-2 pt-0">
        <div className="whitespace-nowrap ml-1 mb-1 gap-2 flex">
          <span className="text-xs font-medium">{username}</span>
          <span className="text-xs font-normal">
            {dayjs(messages[0].createdAt).fromNow()}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-base-content">
          {messages.map((e, index) => (
            <ChatMessageBubble data={e} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
