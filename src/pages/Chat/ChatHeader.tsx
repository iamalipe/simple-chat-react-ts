// import { useSetAtom } from "jotai";
// import { callAtom, callModalAtom } from "../../state";

export interface ChatHeaderProps {
  title: string;
}
export const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  // const setCallModalState = useSetAtom(callModalAtom);
  // const setCallState = useSetAtom(callAtom);

  // const onVideoCall = () => {
  //   setCallModalState(true);
  //   setCallState({
  //     mode: "OUTGOING",
  //   });
  // };

  return (
    <>
      <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
        {title}
      </h1>
      {/* <button
        onClick={onVideoCall}
        className="daisy-btn daisy-btn-xs daisy-btn-neutral ml-auto"
      >
        Video Call
      </button> */}
    </>
  );
};
