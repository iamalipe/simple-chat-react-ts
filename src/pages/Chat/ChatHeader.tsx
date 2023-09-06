export interface ChatHeaderProps {
  title: string;
  onVideoCall: () => void;
}
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onVideoCall,
}) => {
  return (
    <>
      <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
        {title}
      </h1>
      {import.meta.env.DEV && (
        <button
          onClick={onVideoCall}
          className="daisy-btn daisy-btn-xs daisy-btn-neutral ml-auto"
        >
          Video Call
        </button>
      )}
    </>
  );
};
