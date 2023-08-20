import { useState, useEffect } from "react";
import { useCollection, useRealm, useWatch } from ".";
import { ConversationInterface } from "../types";
import {
  addValueAtIndex,
  createObjectId,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";

export const useConversations = () => {
  const { currentUser } = useRealm();
  const [state, setState] = useState<ConversationInterface[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [conversationsCollection, currentUser?.id]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(
    {
      onInsert: (change) => {
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
        const fullDocument = change.fullDocument as ConversationInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (!idx) return prev;
          return updateValueAtIndex(prev, idx, () => {
            return fullDocument;
          });
        });
      },
      onReplace: (change) => {
        const fullDocument = change.fullDocument as ConversationInterface;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (!idx) return prev;
          return replaceValueAtIndex(prev, idx, fullDocument);
        });
      },
    },
    conversationsCollection
  );

  const createConversation = async (otherUserId: string) => {
    if (!conversationsCollection) return;
    if (!currentUser) return;
    setLoading(true);
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
      setLoading(false);
      return newConversations._id.toString() as string;
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return { loading, state, setState, createConversation };
};
