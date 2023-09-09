import { atom } from "jotai";
import { UserInterface } from "../../types";

export const usersAtom = atom<UserInterface[]>([]);
export const currentUserAtom = atom<UserInterface | null>(null);
export const usersLoadingAtom = atom(false);
