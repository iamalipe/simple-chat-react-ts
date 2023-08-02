const Sidebar = () => {
  return (
    <>
      <input
        type="checkbox"
        // defaultChecked
        id="side-bar-toggle"
        className="hidden"
      />
      <div className="side-nav-toggle-target flex-none w-full sm:w-[240px] md:w-[360px] bg-base-100 border-x border-x-base-200 overflow-auto transition-[width] duration-1000 flex flex-col">
        <div className="flex-none bg-base-200 h-12 flex items-center">
          <input type="checkbox" id="new-chat-toggle" className="hidden" />
          <input
            type="text"
            placeholder="Search..."
            className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 new-chat-toggle-target transition-all duration-1000 mr-0"
          />
          <label
            htmlFor="new-chat-toggle"
            className="daisy-btn daisy-btn-neutral daisy-btn-sm mr-12 ml-2 sm:mr-2 max-md:daisy-btn-square new-chat-toggle-button"
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
                d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 22C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5ZM4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V19Z"
                fill="currentColor"
              />
            </svg>
            <span className="hidden md:block">New Chat</span>
          </label>
          <input
            type="text"
            placeholder="Search new user..."
            className="daisy-input daisy-input-sm daisy-input-bordered m-0 min-w-0 new-chat-toggle-target-2 transition-all duration-1000 w-0 flex-none p-0 border-0"
          />
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
        <div className="flex-1 overflow-auto">
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
        </div>
        <button className="daisy-btn m-2">New Chat</button>
      </div>
    </>
  );
};
export default Sidebar;

const ListItem = () => {
  return (
    <div className="flex-none flex h-16 px-2 py-1 text-sm border-y border-y-base-200 hover:bg-base-300 hover:border-y-base-300">
      <div className="daisy-avatar daisy-online w-12 h-12 self-center">
        <div className="w-full rounded-full">
          <img src="https://dummyimage.com/500x500/4166eb/fff.jpg" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center whitespace-nowrap overflow-hidden ml-2">
        <div className="font-medium">Abhiseck BHattacharya</div>
        <span className="font-light">
          Hello, i'm abhiseck bhattacjarya adb jbdubd kdhjdn duj ndu eemksdsd
        </span>
      </div>
    </div>
  );
};
