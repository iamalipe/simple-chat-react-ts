import dayjs from "dayjs";
import { MessageInterface } from "../../types";
import { IKImage } from "imagekitio-react";

export const ChatMessageBubble: React.FC<{
  self?: boolean;
  data: MessageInterface;
}> = ({ data, self }) => {
  const borderClassName = self ? "chat-item-border-self" : "chat-item-border";

  if (data.files.length > 0)
    return (
      <>
        {data.files.map((e, index) => (
          <IKImage key={index} path={e.filePath} className={borderClassName} />
        ))}
        <span className="text-xs font-normal ml-1 h-0 overflow-hidden transition-[height] duration-500">
          {dayjs(data.createdAt).format("MMM D, YYYY h:mm A")}
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
        {dayjs(data.createdAt).format("MMM D, YYYY h:mm A")}
      </span>
    </>
  );
};
