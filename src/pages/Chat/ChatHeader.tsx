import { useSetAtom } from "jotai";
import { callAtom, callModalAtom } from "../../state";
import { VideoCallModal } from "../../components/modals";

export interface ChatHeaderProps {
  title: string;
  conversationId: string;
}
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  conversationId,
}) => {
  const setCallModalState = useSetAtom(callModalAtom);
  const setCallState = useSetAtom(callAtom);

  const onVideoCall = () => {
    setCallModalState(true);
    setCallState({
      conversationId: conversationId,
      mode: "OUTGOING",
    });
  };

  return (
    <>
      <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
        {title}
      </h1>
      <VideoCallModal />
      <button
        onClick={onVideoCall}
        className="daisy-btn daisy-btn-xs daisy-btn-neutral ml-auto"
      >
        Video Call
      </button>
    </>
  );
};
