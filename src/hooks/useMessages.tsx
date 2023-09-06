import { useEffect } from "react";
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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentConversationIdAtom,
  messagesAtom,
  messagesLoadingAtom,
} from "../state";

export const useMessages = () => {
  const { currentUser } = useRealm();
  const setState = useSetAtom(messagesAtom);
  const [loading, setLoading] = useAtom(messagesLoadingAtom);
  const currentConversationId = useAtomValue(currentConversationIdAtom);

  const messagesCollection = useCollection("chatApp", "messages");
  const conversationsCollection = useCollection("chatApp", "conversations");

  useEffect(() => {
    if (!messagesCollection) return;
    if (!currentConversationId) return;
    let shouldUpdate = true;
    const res = messagesCollection.find({
      conversationId: currentConversationId,
    });
    if (shouldUpdate) {
      res.then((data: MessageInterface[]) => {
        setState(data);
        setLoading(false);
      });
    }
    return () => {
      shouldUpdate = false;
    };
  }, [messagesCollection, currentConversationId, setState, setLoading]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(
    {
      onInsert: (change) => {
        if (!currentConversationId) return;
        console.log("onInsert useMessages", currentConversationId);
        const fullDocument = change.fullDocument as MessageInterface;
        if (fullDocument.conversationId !== currentConversationId) return;
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
        if (!currentConversationId) return;
        console.log("onUpdate useMessages");
        const fullDocument = change.fullDocument as MessageInterface;
        if (fullDocument.conversationId !== currentConversationId) return;
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
        if (!currentConversationId) return;
        console.log("onReplace useMessages");
        const fullDocument = change.fullDocument as MessageInterface;
        if (fullDocument.conversationId !== currentConversationId) return;
        setState((prev) => {
          if (loading) return prev;
          const idx = getDocumentIndex(prev, fullDocument);
          if (idx === null) return prev;
          return replaceValueAtIndex(prev, idx, fullDocument);
        });
      },
    },
    messagesCollection
  );

  const sendMessage = async (message: string, fileArray?: File[]) => {
    if (!messagesCollection) return;
    if (!currentUser) return;
    if (!currentConversationId) return;
    try {
      const imageKitFileArray: ImageKitFileInterface[] = [];

      if (fileArray && fileArray.length > 0) {
        const resAll = await Promise.all(
          fileArray.map((file) =>
            imageUploadApi({
              currentUser: currentUser,
              file: file,
              folder: `conversations/${currentConversationId}`,
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
        conversationId: currentConversationId,
        message: message,
        isSeen: false,
        isDelete: false,
        isDisplay: true,
        type: "MESSAGE",
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

  return { sendMessage };
};
