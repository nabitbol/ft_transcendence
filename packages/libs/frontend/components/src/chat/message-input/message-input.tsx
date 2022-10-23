import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import styles from "./message-input.module.css";

/* eslint-disable-next-line */
export interface MessageInputProps {}

export function MessageInput(props: MessageInputProps) {
  const [newMessage, setNewMessage] = useState<string>();

  const handleSend = (e) => {
    e.preventDefault();
    socketChat.emit("client:sendmessage", newMessage);
    setNewMessage("");
  };
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
