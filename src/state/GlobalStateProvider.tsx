import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react";
import { GlobalStateInterface } from "../types";

export const GlobalStateContext = createContext({
  state: {} as GlobalStateInterface,
  setState: {} as Dispatch<SetStateAction<GlobalStateInterface>>,
});

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const localStorage_theme = localStorage.getItem("theme");
  const localStorage_token = localStorage.getItem("token");
  const localStorage_currentUser = localStorage.getItem("currentUser");

  const initState: GlobalStateInterface = {
    theme: localStorage_theme ? localStorage_theme : "system",
    token: localStorage_token,
    currentUser: localStorage_currentUser
      ? JSON.parse(localStorage_currentUser)
      : null,
    isOnline: false,
  };

  const [state, setState] = useState<GlobalStateInterface>(initState);

  // state.theme
  useLayoutEffect(() => {
    const localStorage_theme = localStorage.getItem("theme");
    const htmlElement = document.querySelector("html");
    if (!htmlElement) return;
    if (!state.theme) return;
    if (localStorage_theme !== state.theme)
      localStorage.setItem("theme", state.theme);
    htmlElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // state.token
  useLayoutEffect(() => {
    if (!state.token) return;
    localStorage.setItem("token", state.token);
  }, [state.token]);

  // state.currentUser
  useLayoutEffect(() => {
    if (!state.currentUser) return;
    localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};
