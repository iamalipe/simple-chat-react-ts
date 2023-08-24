import { atom } from "jotai";
import { UserInterface } from "../../types";

export const usersAtom = atom<UserInterface[]>([]);
export const usersLoadingAtom = atom(false);
