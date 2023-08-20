import { MessageInterface, MessagesGroupInterface } from "../types";

export const groupMessagesData = (data: MessageInterface[]) => {
  const formattedData: MessagesGroupInterface[] = [];
  let currentSenderId = "";
  data.forEach((message, index) => {
    if (index === 0) {
      formattedData.push({
        senderId: message.senderId,
        conversationId: message.conversationId,
        messages: [{ ...message }],
      });
      currentSenderId = message.senderId;
    } else {
      if (message.senderId === currentSenderId) {
        // For subsequent messages with the same senderId, add to contents array
        formattedData[formattedData.length - 1].messages.push({
          ...message,
        });
      } else {
        // For messages with a different senderId, create a new entry in formattedData
        formattedData.push({
          senderId: message.senderId,
          conversationId: message.conversationId,
          messages: [{ ...message }],
        });
        currentSenderId = message.senderId;
      }
    }
  });
  const newFormattedData = formattedData.map((e) => {
    if (e.messages.length > 50) {
      return {
        ...e,
        messages: [e.messages[0], e.messages[e.messages.length - 1]],
      };
    } else {
      return e;
    }
  });
  return newFormattedData;
};
