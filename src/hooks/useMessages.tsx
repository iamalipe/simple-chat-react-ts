import { useState, useEffect } from "react";
import { useCollection, useRealm, useWatch } from ".";
import { MessageInterface } from "../types";
import {
  addValueAtIndex,
  createObjectId,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";

export const useMessages = (conversationId: string) => {
  console.log("conversationId", conversationId);

  if (!conversationId) new Error("no conversationId found");

  const { currentUser } = useRealm();
  const [state, setState] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesCollection = useCollection("chatApp", "messages");

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  useEffect(() => {
    if (!messagesCollection) return;
    let shouldUpdate = true;
    const res = messagesCollection.find({ conversationId });
    if (shouldUpdate) {
      res.then((data: MessageInterface[]) => {
        setState(data);
        setLoading(false);
      });
    }
    return () => {
      shouldUpdate = false;
    };
  }, [messagesCollection, conversationId]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(
    {
      onInsert: (change) => {
        console.log("onInsert");
        const fullDocument = change.fullDocument as MessageInterface;
        if (fullDocument.conversationId !== conversationId) return;
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
        const fullDocument = change.fullDocument as MessageInterface;
        if (fullDocument.conversationId !== conversationId) return;
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
        const fullDocument = change.fullDocument as MessageInterface;
        if (fullDocument.conversationId !== conversationId) return;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (!idx) return prev;
          return replaceValueAtIndex(prev, idx, fullDocument);
        });
      },
    },
    messagesCollection
    // { conversationId }
  );

  const sendMessage = async (message: string, imageUrl?: string) => {
    if (!messagesCollection) return;
    if (!currentUser) return;
    try {
      const newMessage: MessageInterface = {
        _id: createObjectId(),
        senderId: currentUser.id,
        createdAt: new Date(),
        modifyAt: new Date(),
        conversationId: conversationId,
        message: message,
        imageUrl: imageUrl || "",
        isImage: imageUrl !== undefined,
        isSeen: false,
      };
      await messagesCollection.insertOne(newMessage);
    } catch (err) {
      console.error(err);
    }
  };

  return { loading, state, setState, sendMessage };
};
