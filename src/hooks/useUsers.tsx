import { useEffect } from "react";
import { useCollection, useRealm, useWatch } from ".";
import { UserInterface } from "../types";
import {
  addValueAtIndex,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";
import { useSetAtom, useAtom } from "jotai";
import { usersAtom, usersLoadingAtom } from "../state";

export const useUsers = () => {
  const setState = useSetAtom(usersAtom);
  const [loading, setLoading] = useAtom(usersLoadingAtom);

  const { currentUser } = useRealm();

  const usersCollection = useCollection("chatApp", "users");

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  useEffect(() => {
    if (!usersCollection) return;
    let shouldUpdate = true;
    const res = usersCollection.find({});
    if (shouldUpdate) {
      res.then((data: UserInterface[]) => {
        setState(data);
        setLoading(false);
      });
    }
    return () => {
      shouldUpdate = false;
    };
  }, [setLoading, setState, usersCollection]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(
    {
      onInsert: (change) => {
        const fullDocument = change.fullDocument as UserInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument) ?? prev.length;
          if (idx === prev.length) {
            return addValueAtIndex(prev, idx, fullDocument);
          } else {
            return prev;
          }
        });
      },
      onUpdate: (change) => {
        const fullDocument = change.fullDocument as UserInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (idx === null) return prev;
          return updateValueAtIndex(prev, idx, () => {
            return fullDocument;
          });
        });
      },
      onReplace: (change) => {
        const fullDocument = change.fullDocument as UserInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (idx === null) return prev;
          return replaceValueAtIndex(prev, idx, fullDocument);
        });
      },
    },
    usersCollection
  );

  const getCurrentUserInfo = async () => {
    if (!currentUser) return;
    try {
      const userInfo = await usersCollection?.findOne({ _id: currentUser.id });
      return userInfo as UserInterface;
    } catch (err) {
      console.error(err);
    }
  };

  return { getCurrentUserInfo };
};
