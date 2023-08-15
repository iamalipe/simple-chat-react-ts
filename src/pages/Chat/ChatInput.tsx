import { useState, useMemo } from "react";
import { toast } from "../../utils";

interface ChatInputProps {
  onSendMessage: (value: string, fileArray?: File[]) => Promise<void>;
}
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [value, setValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    if (selectedFiles.length > 0) {
      await onSendMessage(value, selectedFiles);
    } else if (value.length > 1) {
      await onSendMessage(value);
    }
    setValue("");
    setSelectedFiles([]);
  };

  const removeSelectedFiles = (index: number) => {
    setSelectedFiles((prev) => {
      const newPrev = [...prev];
      if (index > -1) {
        newPrev.splice(index, 1);
      }
      return newPrev;
    });
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const files = e.target.files;
    if (!files) return;
    if (files.length > 5) {
      toast("you can select 5 images at a time");
      return;
    }
    const newFiles: File[] = [];
    for (const file of files) {
      if (file.type.includes("image")) newFiles.push(file);
    }
    setSelectedFiles(newFiles);
  };

  return (
    <div className="flex-none bg-base-200 flex flex-col px-2 sm:px-6">
      {selectedFiles.length > 0 && (
        <div className="border-b border-b-base-content/25 max-h-24 py-4 px-2 flex gap-4 overflow-auto">
          {selectedFiles.map((file, index) => (
            <ImageUploadPreview
              key={index}
              file={file}
              onClear={() => removeSelectedFiles(index)}
            />
          ))}
        </div>
      )}
      <div className="flex flex-col max-h-48">
        <textarea
          id="input-textarea"
          placeholder="Type a message..."
          className="border-none outline-none w-full px-2 resize-none min-h-[2rem] mt-2 bg-transparent text-base-content text-base overflow-auto"
          value={value}
          rows={1}
          onChange={(e) => onValueChange(e.target.value)}
        ></textarea>
      </div>
      <div className="h-10 flex items-center border-t border-t-base-content/25 gap-2 px-1">
        <input
          type="file"
          id="chat-input-upload"
          className="hidden"
          accept="image/*"
          multiple
          onChange={onFileChange}
        />
        <label htmlFor="chat-input-upload">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-neutral"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13C8.65685 13 10 11.6569 10 10C10 8.34315 8.65685 7 7 7ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10Z"
              className="fill-neutral"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V6C24 4.34315 22.6569 3 21 3H3ZM21 5H3C2.44772 5 2 5.44772 2 6V18C2 18.5523 2.44772 19 3 19H7.31374L14.1924 12.1214C15.364 10.9498 17.2635 10.9498 18.435 12.1214L22 15.6863V6C22 5.44772 21.5523 5 21 5ZM21 19H10.1422L15.6066 13.5356C15.9971 13.145 16.6303 13.145 17.0208 13.5356L21.907 18.4217C21.7479 18.7633 21.4016 19 21 19Z"
              className="fill-neutral"
            />
          </svg>
        </label>
        <button
          onClick={onSend}
          className="daisy-btn daisy-btn-xs daisy-btn-neutral ml-auto w-32"
        >
          Send
        </button>
      </div>
    </div>
  );
};

interface ImageUploadPreviewProps {
  file: File;
  onClear: () => void;
}
const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  file,
  onClear,
}) => {
  const fileUrl = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div className="h-full relative flex-none">
      <img src={fileUrl} className="w-full h-full" alt="" />
      <button
        onClick={onClear}
        className="daisy-btn daisy-btn-circle daisy-btn-xs daisy-btn-neutral absolute -top-2.5 -right-2.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
