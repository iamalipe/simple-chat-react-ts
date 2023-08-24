import { useEffect } from "react";
import { useCollection, useRealm, useWatch } from ".";
import { ConversationInterface } from "../types";
import {
  addValueAtIndex,
  createObjectId,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";
import { useAtom, useSetAtom } from "jotai";
import { conversationsAtom, conversationsLoadingAtom } from "../state";

export const useConversations = () => {
  const { currentUser } = useRealm();
  const setState = useSetAtom(conversationsAtom);
  const [loading, setLoading] = useAtom(conversationsLoadingAtom);

  const conversationsCollection = useCollection("chatApp", "conversations");

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  useEffect(() => {
    if (!conversationsCollection) return;
    let shouldUpdate = true;
    const res = conversationsCollection.find({ users: currentUser?.id });
    if (shouldUpdate) {
      res.then((data: ConversationInterface[]) => {
        setState(data);
        setLoading(false);
      });
    }
    return () => {
      shouldUpdate = false;
    };
  }, [conversationsCollection, currentUser?.id, setLoading, setState]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(
    {
      onInsert: (change) => {
        console.log("onInsert useConversations");
        const fullDocument = change.fullDocument as ConversationInterface;
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
        console.log("onUpdate useConversations");
        const fullDocument = change.fullDocument as ConversationInterface;
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
        console.log("onReplace useConversations");
        const fullDocument = change.fullDocument as ConversationInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (idx === null) return prev;
          return replaceValueAtIndex(prev, idx, fullDocument);
        });
      },
    },
    conversationsCollection
  );

  const createConversation = async (otherUserId: string) => {
    if (!conversationsCollection) return;
    if (!currentUser) return;
    try {
      const usersIds = [currentUser.id, otherUserId].sort();
      const res = await conversationsCollection.findOne({
        users: usersIds,
      });
      if (res) {
        return res._id.toString() as string;
      }
      const newConversations: ConversationInterface = {
        _id: createObjectId(),
        users: usersIds,
        createdAt: new Date(),
        modifyAt: new Date(),
        isThereNewMessage: false,
      };

      await conversationsCollection.insertOne(newConversations);
      return newConversations._id.toString() as string;
    } catch (err) {
      console.error(err);
    }
  };

  return { createConversation };
};
