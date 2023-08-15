import { useRealm } from "../../../hooks";

export const LogoutProfilePopupItem = () => {
  const { currentUser, logOut } = useRealm();

  const onLogout = async () => {
    await logOut();
  };

  return (
    <div className="h-12 border-b border-b-base-300 px-4 flex items-center">
      {currentUser && (
        <button
          onClick={onLogout}
          className="daisy-btn daisy-btn-neutral daisy-btn-sm w-full"
        >
          Logout
        </button>
      )}
    </div>
  );
};
