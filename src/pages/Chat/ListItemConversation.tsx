import { useNavigate } from "react-router-dom";
import { ConversationInterface, RouteNames } from "../../types";
import { useRealm } from "../../hooks";
import { useAtomValue } from "jotai";
import { usersAtom } from "../../state";
// import dayjs from "dayjs";

export interface ListItemConversationProps {
  data: ConversationInterface;
}
export const ListItemConversation: React.FC<ListItemConversationProps> = ({
  data,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useRealm();
  const usersState = useAtomValue(usersAtom);

  const otherUserId = data.users.find((e) => e !== currentUser?.id);
  const otherUserIdEmail = usersState.find((e) => e._id === otherUserId)?.email;

  const onOpenChat = () => {
    navigate(RouteNames.CHAT, {
      state: {
        conversationId: data._id.toString(),
        userId: undefined,
        title: otherUserIdEmail,
      },
    });
    document.getElementById("side-bar-toggle")?.click();
  };

  return (
    <div
      onClick={onOpenChat}
      className="cursor-pointer flex-none flex h-16 px-2 py-1 text-sm border-y border-y-base-200 hover:bg-base-300 hover:border-y-base-300"
    >
      <div className="daisy-avatar daisy-online w-12 h-12 self-center">
        <div className="w-full rounded-full">
          <img src="https://dummyimage.com/500x500/4166eb/fff.jpg" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center whitespace-nowrap overflow-hidden ml-2">
        <div className="font-medium">{otherUserIdEmail}</div>
        <span className="font-light">{data.lastMessage}</span>
        {/* <span className="font-light">{data.lastMessage}</span> */}
      </div>
    </div>
  );
};
