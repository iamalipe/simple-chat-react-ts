import { useGlobalState } from "../state";
import { THEMES_OBJECT } from "../utils";

const Header = () => {
  const { state, setState } = useGlobalState();
  const onChangeTheme: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value;
    setState({ ...state, theme: value });
  };

  const onLogout = () => {
    // localStorage.removeItem("currentUser");
    // localStorage.removeItem("token");
    // setState((prev) => ({ ...prev, currentUser: null, token: null }));
  };

  return (
    <>
      <div className="w-full bg-base-100 border-b border-b-neutral flex-none h-12 flex overflow-auto items-center px-2 md:px-12">
        <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
          Simple <span className="font-bold text-primary">Chat</span>
        </h1>
        {/* {state.isOnline ? (
          <span className="ml-auto mr-2 daisy-btn daisy-btn-sm daisy-btn-success">
            Online
          </span>
        ) : (
          <span className="ml-auto mr-2 daisy-btn daisy-btn-sm daisy-btn-error">
            Offline
          </span>
        )} */}
        <div className="flex sm:gap-4 gap-2 items-center">
          <span className="hidden sm:block">Theme</span>
          <select
            className="daisy-select daisy-select-bordered daisy-select-xs sm:daisy-select-sm w-20 sm:w-full max-w-xs"
            onChange={onChangeTheme}
            value={state.theme}
          >
            {THEMES_OBJECT.map((themeOption, key) => {
              return (
                <option key={key} value={themeOption.value}>
                  {themeOption.option}
                </option>
              );
            })}
          </select>
        </div>

        {state.token && (
          <button
            onClick={onLogout}
            className="daisy-btn daisy-btn-neutral daisy-btn-xs sm:daisy-btn-sm ml-2 sm:ml-4"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};
export default Header;
