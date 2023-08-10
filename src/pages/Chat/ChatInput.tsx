import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (value: string) => Promise<void>;
}
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
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

  const onSend = async () => {
    if (value.length < 1) return;
    await onSendMessage(value);
    setValue("");
  };

  return (
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
        <button
          onClick={onSend}
          className="daisy-btn daisy-btn-xs daisy-btn-neutral ml-auto"
        >
          Send
        </button>
      </div>
    </div>
  );
};
