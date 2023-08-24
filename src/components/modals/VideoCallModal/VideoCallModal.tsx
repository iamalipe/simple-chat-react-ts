import { useEffect } from "react";
import { useAudioVideoCall } from "../../../hooks";
import { callAtom, callModalAtom } from "../../../state";
import { useAtom } from "jotai";
import ReactPlayer from "react-player";
import { CallSessionsModeEnum } from "../../../types";

export const VideoCallModal = () => {
  // const { currentUser } = useRealm();
  const [callModalState, setCallModalState] = useAtom(callModalAtom);
  const audioVideoCall = useAudioVideoCall();
  const [callState, setCallState] = useAtom(callAtom);

  const openModal = () => {
    const VideoCallModal = document.getElementById(
      "VideoCallModal"
    ) as HTMLDialogElement | null;
    VideoCallModal?.showModal();
  };
  const closeModal = () => {
    const VideoCallModal = document.getElementById(
      "VideoCallModal"
    ) as HTMLDialogElement | null;
    VideoCallModal?.close();
  };

  useEffect(() => {
    if (callModalState) {
      openModal();
      if (callState.mode === "OUTGOING") {
        audioVideoCall.connectCall();
      }
      if (
        callState.mode === "INCOMING" &&
        callState.from &&
        callState.offer &&
        callState.callId
      ) {
        if (callState.rtcMode === CallSessionsModeEnum.CALLING) {
          audioVideoCall.acceptIncomingCall({
            callId: callState.callId,
            from: callState.from,
            offer: callState.offer,
          });
        } else if (
          callState.rtcMode === CallSessionsModeEnum.ACCEPTING &&
          callState.ans
        ) {
          audioVideoCall.callAccepted({ ans: callState.ans });
        } else {
          console.log("callState.rtcMode", callState.rtcMode);
        }
      }
    } else {
      closeModal();
    }
  }, [audioVideoCall, callModalState, callState]);

  const onCallEnd = async () => {
    console.log("onCallEnd");
    callState.myStream?.getTracks().forEach((track) => track.stop());
    callState.otherStream?.getTracks().forEach((track) => track.stop());
    // audioVideoCall.disconnectCall();
  };

  return (
    <>
      <dialog id="VideoCallModal" className="daisy-modal">
        <div className="daisy-modal-box relative bg-black w-[90%] max-w-[95%] sm:w-[95%] sm:max-w-[90%] md:w-[80%] md:max-w-[80%] h-[90%] max-h-[95%] sm:h-[95%] sm:max-h-[90%] md:h-[80%] md:max-h-[80%]">
          <ReactPlayer
            playing
            width="100%"
            height="100%"
            url={callState.otherStream}
          />
          <ReactPlayer
            style={{
              backgroundColor: "black",
              position: "absolute",
              bottom: 0,
              right: 20,
              border: "1px solid white",
            }}
            playing
            width="200px"
            height="200px"
            url={callState.myStream}
          />
          <div className="absolute bottom-5 flex items-center gap-2 left-1/2 -translate-x-1/2 p-1">
            <button className="daisy-btn daisy-btn-circle daisy-btn-sm">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 4.5V6.5H12V7.5H3C1.34315 7.5 0 8.84315 0 10.5V16.5C0 18.1569 1.34315 19.5 3 19.5H15C16.5731 19.5 17.8634 18.2892 17.9898 16.7487L24 17.5V9.5L17.9898 10.2513C17.8634 8.71078 16.5731 7.5 15 7.5H14V5.5C14 4.94772 13.5523 4.5 13 4.5H4ZM18 12.2656V14.7344L22 15.2344V11.7656L18 12.2656ZM16 10.5C16 9.94772 15.5523 9.5 15 9.5H3C2.44772 9.5 2 9.94772 2 10.5V16.5C2 17.0523 2.44772 17.5 3 17.5H15C15.5523 17.5 16 17.0523 16 16.5V10.5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="daisy-btn daisy-btn-circle daisy-btn-sm">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 4C9 2.34315 10.3431 1 12 1C13.6569 1 15 2.34315 15 4V12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12V4ZM13 4V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4Z"
                  fill="currentColor"
                />
                <path
                  d="M18 12C18 14.973 15.8377 17.441 13 17.917V21H17V23H7V21H11V17.917C8.16229 17.441 6 14.973 6 12V9H8V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V9H18V12Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              onClick={onCallEnd}
              className="daisy-btn daisy-btn-circle daisy-btn-sm daisy-btn-error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
        </div>
      </dialog>
    </>
  );
};
