import { useConversations, useRealm, useUsers } from "../hooks";
import { ListItemConversation, ListItemUser } from "../pages/Chat";
import { useState } from "react";

const Sidebar = () => {
  const { currentUser } = useRealm();
  const [searchValue, setSearchValue] = useState("");
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const conversations = useConversations();
  const users = useUsers();

  const usersListWithoutCurrentUser = users.state.filter(
    (e) => e._id !== currentUser?.id
  );

  const onSearchValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setSearchValue(e.target.value);
  };

  const onSearchClick = () => {
    console.log("onSearchClick");
  };

  return (
    <>
      <input type="checkbox" id="side-bar-toggle" className="hidden" />
      <div className="side-nav-toggle-target flex-none w-full sm:w-[240px] md:w-[360px] bg-base-100 border-x border-x-base-200 overflow-auto transition-[width] duration-1000 flex flex-col">
        <div className="flex-none bg-base-200 h-12 flex items-center">
          <input
            value={searchValue}
            onChange={onSearchValueChange}
            type="text"
            placeholder={
              isUserListOpen ? "Search user ..." : "Search conversation ..."
            }
            className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 transition-all duration-1000 mr-0"
          />
          <button
            onClick={onSearchClick}
            className="daisy-btn daisy-btn-neutral daisy-btn-sm mr-12 ml-2 sm:mr-2 max-md:daisy-btn-square"
          >
            <svg
              className="h-5 w-5 md:hidden"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                fill="currentColor"
              />
            </svg>
            <span className="hidden md:block">Search</span>
          </button>
          <label
            htmlFor="side-bar-toggle"
            className="daisy-btn daisy-btn-square daisy-btn-sm daisy-btn-neutral side-nav-toggle-button absolute sm:relative sm:hidden transition-[left] duration-1000"
          >
            <svg
              className="h-5 w-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.99519C2 5.44556 2.44556 5 2.99519 5H11.0048C11.5544 5 12 5.44556 12 5.99519C12 6.54482 11.5544 6.99039 11.0048 6.99039H2.99519C2.44556 6.99039 2 6.54482 2 5.99519Z"
                fill="currentColor"
              />
              <path
                d="M2 11.9998C2 11.4501 2.44556 11.0046 2.99519 11.0046H21.0048C21.5544 11.0046 22 11.4501 22 11.9998C22 12.5494 21.5544 12.9949 21.0048 12.9949H2.99519C2.44556 12.9949 2 12.5494 2 11.9998Z"
                fill="currentColor"
              />
              <path
                d="M2.99519 17.0096C2.44556 17.0096 2 17.4552 2 18.0048C2 18.5544 2.44556 19 2.99519 19H15.0048C15.5544 19 16 18.5544 16 18.0048C16 17.4552 15.5544 17.0096 15.0048 17.0096H2.99519Z"
                fill="currentColor"
              />
            </svg>
          </label>
        </div>
        <div
          className={`overflow-auto transition-all duration-1000 scroll-smooth h-0 ${
            isUserListOpen ? "flex-none" : "flex-1"
          }`}
        >
          {conversations.state.map((e, index) => (
            <ListItemConversation key={index} data={e} users={users.state} />
          ))}
        </div>
        <button
          onClick={() => setIsUserListOpen((prev) => !prev)}
          className="daisy-btn m-2"
        >
          {isUserListOpen ? "Back to conversations" : "new Conversation"}
        </button>
        <div
          className={`overflow-auto transition-all duration-1000 scroll-smooth h-0 ${
            !isUserListOpen ? "flex-none" : "flex-1"
          }`}
        >
          {usersListWithoutCurrentUser.map((e, index) => (
            <ListItemUser
              key={index}
              data={e}
              onClick={() => setIsUserListOpen((prev) => !prev)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default Sidebar;
