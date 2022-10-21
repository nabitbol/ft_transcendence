import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { MessageDto } from "@ft-transcendence/libs-shared-types";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./message.module.css";

/* eslint-disable-next-line */
export interface MessageProps {
  own: boolean;
}

export function Message(props: MessageProps) {
  const [scroll, setScroll] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageDto[]>(undefined);
  const [author, setAuthor] = useState<string[]>(undefined);
  const scrollRef = useRef(null);

  const scrollToEnd = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    setScroll(false);
  }, []);

  const listenerRoomMessages = (response: {
    messages: MessageDto[];
    userMessages: string[];
  }) => {
    if (messages) {
      setMessages(response.messages);
      setAuthor(response.userMessages);
    }
    setScroll(true);
  };

  useEffect(() => {
    socketChat.on("server:getroommessages", listenerRoomMessages);
    return () => {
      socketChat.off("server:getroommessages", listenerRoomMessages);
    };
  }, [messages]);

  useEffect(() => {
    if (scroll === true) scrollToEnd();
  }, [scroll, scrollToEnd]);

  return (
    <div className={props.own ? styles["message-own"] : styles["message"]}>
      {messages &&
        messages.map((element, key) => (
          <div>
            <div className={styles["messageTop"]} key={key}>
              <img
                className={styles["messageImg"]}
                src={getPathToImage("utilisateur")}
                alt="avatar"
              />
              <p className={styles["messageText"]}>{element.content}</p>
            </div>
            <div className={styles["messageBottom"]}>{author}</div>
          </div>
        ))}
      {!messages && <p>{"no message in the chat"}</p>}
    </div>
  );
}

export default Message;
