import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
} from "react";
import * as RealmWeb from "realm-web";
import { atlasConfig } from "../config";

function createApp(id: string) {
  return new RealmWeb.App({ id, baseUrl: atlasConfig.baseUrl });
}

export interface IRealmAppContext {
  currentUser: Realm.User<
    Realm.DefaultFunctionsFactory & Realm.BaseFunctionsFactory,
    Realm.DefaultUserProfileData
  > | null;
  logIn: (
    credentials: Realm.Credentials<Realm.Credentials.EmailPasswordPayload>
  ) => Promise<void>;
  logOut: () => Promise<void>;
  app: ReturnType<typeof createApp>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const RealmAppContext = createContext<IRealmAppContext>(null);

export const RealmAppProvider: React.FC<{
  children: React.ReactNode;
  appId: string;
}> = ({ appId, children }) => {
  // Store Realm.App in React state. If appId changes, all children will rerender and use the new App.
  const [app, setApp] = useState(createApp(appId));
  useEffect(() => {
    setApp(createApp(appId));
  }, [appId]);

  // Store the app's current user in state and wrap the built-in auth functions to modify this state
  const [currentUser, setCurrentUser] = useState(app.currentUser);

  // Wrap the base logIn function to save the logged in user in state
  const logIn = useCallback(
    async (
      credentials: Realm.Credentials<Realm.Credentials.EmailPasswordPayload>
    ) => {
      await app.logIn(credentials);
      setCurrentUser(app.currentUser);
    },
    [app]
  );

  // Wrap the current user's logOut function to remove the logged out user from state
  const logOut = useCallback(async () => {
    try {
      const user = app.currentUser;
      if (!user) return;
      await user?.logOut();
      await app.removeUser(user);
    } catch (err) {
      console.error(err);
    }

    // In this App there will only be one logged in user at a time, so
    // the new current user will be null. If you add support for
    // multiple simultaneous user logins, this updates to another logged
    // in account if one exists.
    setCurrentUser(app.currentUser);
  }, [app]);

  // Override the App's currentUser & logIn properties + include the app-level logout function
  const appContext: IRealmAppContext = useMemo(() => {
    return { app, currentUser, logIn, logOut };
  }, [app, currentUser, logIn, logOut]);

  return (
    <RealmAppContext.Provider value={appContext}>
      {children}
    </RealmAppContext.Provider>
  );
};
