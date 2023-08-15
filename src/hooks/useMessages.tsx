import { useState, useEffect } from "react";
import { useCollection, useRealm, useWatch } from ".";
import { ImageKitFileInterface, MessageInterface } from "../types";
import {
  addValueAtIndex,
  createObjectId,
  getDocumentIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
} from "../utils";
import { imageUploadApi } from "../services";

export const useMessages = (conversationId: string) => {
  // console.log("conversationId", conversationId);

  if (!conversationId) new Error("no conversationId found");

  const { currentUser } = useRealm();
  const [state, setState] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesCollection = useCollection("chatApp", "messages");
  const conversationsCollection = useCollection("chatApp", "conversations");

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

  const sendMessage = async (message: string, fileArray?: File[]) => {
    if (!messagesCollection) return;
    if (!currentUser) return;
    try {
      const imageKitFileArray: ImageKitFileInterface[] = [];

      if (fileArray && fileArray.length > 0) {
        const resAll = await Promise.all(
          fileArray.map((file) =>
            imageUploadApi({
              currentUser: currentUser,
              file: file,
              folder: `conversations/${conversationId}`,
            })
          )
        );
        for (const res of resAll)
          imageKitFileArray.push({
            fileId: res.fileId,
            name: res.name,
            url: res.url,
            thumbnailUrl: res.thumbnailUrl,
            size: res.size,
            filePath: res.filePath,
            isPrivateFile: res.isPrivateFile,
          });
      }

      const newMessage: MessageInterface = {
        _id: createObjectId(),
        senderId: currentUser.id,
        createdAt: new Date(),
        modifyAt: new Date(),
        conversationId: conversationId,
        message: message,
        isSeen: false,
        files: imageKitFileArray,
      };
      await messagesCollection.insertOne(newMessage);
      await conversationsCollection?.updateOne(
        { _id: { $oid: newMessage.conversationId } },
        {
          $set: {
            lastMessage: newMessage.message,
            lastMessageId: newMessage._id,
            lastMessageTime: newMessage.modifyAt,
            isThereNewMessage: true,
            modifyAt: new Date(),
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return { loading, state, setState, sendMessage };
};
