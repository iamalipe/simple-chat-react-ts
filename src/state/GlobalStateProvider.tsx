import React, {
  createContext,
  useState,
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

  const initState: GlobalStateInterface = {
    theme: localStorage_theme ? localStorage_theme : "system",
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

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
