import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react";

export interface GlobalStateInterface {
  theme: string;
}

export const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const localStorageTheme = localStorage.getItem("localTheme");
  const initState: Partial<GlobalStateInterface> = {
    theme: localStorageTheme ? localStorageTheme : "system",
  };

  const [state, setState] = useState(initState);

  useLayoutEffect(() => {
    const htmlElement = document.querySelector("html");
    if (!htmlElement) return;
    if (!state.theme) return;
    if (localStorageTheme !== state.theme)
      localStorage.setItem("localTheme", state.theme);
    htmlElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};
