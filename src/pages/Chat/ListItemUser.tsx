import { useNavigate } from "react-router-dom";
import { RouteNames, UserInterface } from "../../types";
import dayjs from "dayjs";

export interface ListItemUserProps {
  data: UserInterface;
  onClick: () => void;
}
export const ListItemUser: React.FC<ListItemUserProps> = ({
  data,
  onClick,
}) => {
  const navigate = useNavigate();
  const onOpenChat = () => {
    navigate(RouteNames.CHAT, {
      state: {
        conversationId: undefined,
        userId: data._id,
        title: data.email,
        otherUserInfo: data,
      },
    });
    onClick();
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
        <div className="font-medium">{data.email}</div>
        <span className="font-light">
          Joined on {dayjs(data.createdAt).format("MMMM D, YYYY")}
        </span>
      </div>
    </div>
  );
};
