import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { useCallback, useEffect, useState } from "react";
import styles from "./message-input.module.css";

/* eslint-disable-next-line */
export interface MessageInputProps {}

export function MessageInput(props: MessageInputProps) {
  const [newMessage, setNewMessage] = useState<string>();

  const listenerSendMessageError = useCallback((err) => {
    if (err.message.search("Message:") !== -1) alert(err.message);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage && newMessage.length !== 0)
      socketChat.emit("client:sendmessage", newMessage);
    setNewMessage("");
  };

  useEffect(() => {
    socketChat.on("exception", listenerSendMessageError);
    return () => {
      socketChat.off("exception", listenerSendMessageError);
    };
  }, [listenerSendMessageError]);

  return (
    <form className={styles["chatSendBox"]} onSubmit={handleSend}>
      <textarea
        className={styles["chatMessageInput"]}
        placeholder="Write your newMessage here..."
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
      ></textarea>
      <button type="submit" className={styles["chatSubmitButton"]}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;
