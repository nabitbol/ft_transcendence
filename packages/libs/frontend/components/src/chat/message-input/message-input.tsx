import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { useCallback, useEffect, useState } from "react";
import styles from "./message-input.module.css";

/* eslint-disable-next-line */
export interface MessageInputProps {}

export function MessageInput(props: MessageInputProps) {
  const [newMessage, setNewMessage] = useState<string>();

  const listenerSendMessageError = useCallback((err) => {
    alert(err.message);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
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
    <div className={styles["chatSendBox"]}>
      <textarea
        className={styles["chatMessageInput"]}
        placeholder="Write your newMessage here..."
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
      ></textarea>
      <button
        className={styles["chatSubmitButton"]}
        onClick={(e) => handleSend(e)}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
