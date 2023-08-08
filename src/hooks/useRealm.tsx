import { useContext } from "react";
import { RealmAppContext } from "../state";

export const useRealm = () => {
  const app = useContext(RealmAppContext);
  if (!app) {
    throw new Error(
      `No App Services App found. Make sure to call useRealm() inside of a <RealmAppProvider />.`
    );
  }
  return app;
};
