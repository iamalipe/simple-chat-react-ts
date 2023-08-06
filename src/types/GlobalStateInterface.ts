export interface GlobalStateInterface {
  theme: string;
  token: string | null;
  currentUser: CurrentUserInterface | null;
  isOnline: boolean;
}

export interface CurrentUserInterface {
  email: string;
  userId: string;
  username: string;
}
