import dayjs from "dayjs";
import { ChatInterface } from ".";

export const ChatMessageBubble: React.FC<{
  self?: boolean;
  data: ChatInterface;
}> = ({ data, self }) => {
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
