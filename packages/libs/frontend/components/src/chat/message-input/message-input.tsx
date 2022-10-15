import styles from "./message-input.module.css";

/* eslint-disable-next-line */
export interface MessageInputProps {}

export function MessageInput(props: MessageInputProps) {
  return (
    <div className={styles["chatSendBox"]}>
      <textarea
        className={styles["chatMessageInput"]}
        placeholder="Write your message here..."
      ></textarea>
      <button className={styles["chatSubmitButton"]}>Send</button>
    </div>
  );
}

export default MessageInput;
