import { useState, useEffect } from "react";
import { useCollection, useWatch } from ".";
import { ConversationInterface } from "../types";
import {
  addValueAtIndex,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";

export const useConversations = () => {
  const [state, setState] = useState<ConversationInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const usersCollection = useCollection("chatApp", "conversations");

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  useEffect(() => {
    if (!usersCollection) return;
    let shouldUpdate = true;
    const res = usersCollection.find({});
    if (shouldUpdate) {
      res.then((data: ConversationInterface[]) => {
        setState(data);
        setLoading(false);
      });
    }
    return () => {
      shouldUpdate = false;
    };
  }, [usersCollection]);

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
    usersCollection
  );

  return { loading, state, setState };
};
