import { useEffect } from "react";
import { useCollection, useRealm, useWatch } from ".";
import { ImageKitFileInterface, UserInterface } from "../types";
import {
  addValueAtIndex,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";
import { useSetAtom, useAtom } from "jotai";
import { currentUserAtom, usersAtom, usersLoadingAtom } from "../state";
import { imageUploadApi } from "../services";

export const useUsers = () => {
  const setState = useSetAtom(usersAtom);
  const setCurrentUserState = useSetAtom(currentUserAtom);
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
        const findCurrent = data.find((e) => e._id === currentUser?.id);
        if (findCurrent) setCurrentUserState(findCurrent);
        setLoading(false);
      });
    }
    return () => {
      shouldUpdate = false;
    };
  }, [
    currentUser?.id,
    setCurrentUserState,
    setLoading,
    setState,
    usersCollection,
  ]);

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
        if (!currentUser) return;
        if (currentUser.id === fullDocument._id)
          setCurrentUserState(fullDocument);
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
        if (!currentUser) return;
        if (currentUser.id === fullDocument._id)
          setCurrentUserState(fullDocument);
      },
      onReplace: (change) => {
        const fullDocument = change.fullDocument as UserInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (idx === null) return prev;
          return replaceValueAtIndex(prev, idx, fullDocument);
        });
        if (!currentUser) return;
        if (currentUser.id === fullDocument._id)
          setCurrentUserState(fullDocument);
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

  const updateCurrentUserInfo = async (payload: {
    profileImage?: File;
    fullName?: string;
  }) => {
    if (!currentUser) return;
    const newPayload: {
      modifyAt: Date;
      fullName?: string;
      profileImage?: ImageKitFileInterface;
    } = { modifyAt: new Date() };

    try {
      if (payload.profileImage) {
        const file = payload.profileImage;
        const res = await imageUploadApi({
          currentUser: currentUser,
          file: file,
          folder: `profile/${currentUser.id}`,
          overwriteFile: true,
        });

        newPayload.profileImage = {
          fileId: res.fileId,
          filePath: res.filePath,
          isPrivateFile: res.isPrivateFile,
          name: res.name,
          size: res.size,
          thumbnailUrl: res.thumbnailUrl,
          url: res.url,
        };
      }
      if (payload.fullName) newPayload.fullName = payload.fullName;

      await usersCollection?.updateOne(
        { _id: currentUser.id },
        {
          $set: newPayload,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return { getCurrentUserInfo, updateCurrentUserInfo };
};
