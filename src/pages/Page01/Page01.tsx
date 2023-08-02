/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import data from "./data.json";

interface ChatInterface {
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

interface ChatMessagesGroupInterface {
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

const Page01 = () => {
  const newData = groupChatData(chatData);
  const myId = "64c92f0efc13ae533baf11e9";

  return (
    <div className="flex-1 w-full bg-base-100 flex flex-col">
      <div className="flex-none bg-base-200 h-12 flex items-center px-12 sm:px-6">
        <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
          Abhiseck Bhattacharya
        </h1>
        {/* <input
          type="text"
          placeholder="Search..."
          className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 new-chat-toggle-target transition-all duration-1000 mr-0"
        /> */}
      </div>
      <div className="p-2 sm:p-5 flex-1 overflow-auto flex flex-col gap-2">
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
      </div>
      <div className="flex-none bg-base-200 h-12 flex items-center px-12 sm:px-6">
        <input
          type="text"
          placeholder="Search..."
          className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 new-chat-toggle-target transition-all duration-1000 mr-0"
        />
      </div>
    </div>
  );
};
export default Page01;

interface ChatMessageProps {
  messages: ChatInterface[];
  username: string;
}
const ChatMessageSelf: React.FC<ChatMessageProps> = ({ messages }) => {
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
const ChatMessage: React.FC<ChatMessageProps> = ({ messages, username }) => {
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

const ChatMessageBubble: React.FC<{ self?: boolean; data: ChatInterface }> = ({
  data,
  self,
}) => {
  const borderClassName = self ? "chat-item-border-self" : "chat-item-border";

  if (data.isImage)
    return (
      <>
        <img className={borderClassName} src={data.imageUrl} />
        <span className="text-xs font-normal ml-1 h-0 overflow-hidden transition-[height] duration-500">
          {dayjs(data.updatedAt).format("MMM D, YYYY h:mm A")}
        </span>
      </>
    );
  return (
    <>
      <p
        className={`p-2 bg-base-300 w-fit hover:bg-base-content hover:text-base-300 transition-all duration-1000 ${borderClassName}`}
      >
        {data.message}
      </p>
      <span className="text-xs font-normal ml-1 h-0 overflow-hidden transition-[height] duration-500">
        {dayjs(data.updatedAt).format("MMM D, YYYY h:mm A")}
      </span>
    </>
  );
};
