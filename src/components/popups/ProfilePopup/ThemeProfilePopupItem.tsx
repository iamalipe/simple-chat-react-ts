import { useGlobalState } from "../../../hooks";
import { THEMES_OBJECT } from "../../../utils";

export const ThemeProfilePopupItem = () => {
  const { state, setState } = useGlobalState();

  const onChangeTheme: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value;
    setState({ ...state, theme: value });
  };

  return (
    <div className="flex items-center gap-4 h-12 border-b border-b-base-300 px-4">
      <span>Theme</span>
      <select
        className="daisy-select daisy-select-bordered daisy-select-sm w-full"
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
  );
};
