import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { MessageDto, UserDto } from "@ft-transcendence/libs-shared-types";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./message.module.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

/* eslint-disable-next-line */
export interface MessageProps {
  user: UserDto;
}
TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

export function Message(props: MessageProps) {
  const [scroll, setScroll] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageDto[]>(undefined);
  const [empty, setEmpty] = useState<boolean>(false);
  const [authors, setAuthors] = useState<string[]>(undefined);
  const scrollRef = useRef(null);

  const scrollToEnd = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    setScroll(false);
  }, []);

  const listenerRoomMessages = useCallback(
    (response: { messages: MessageDto[]; authors: string[] }) => {
      if (response.messages) {
        if (response.messages.length > 0) setEmpty(false);
        else setEmpty(true);
        setMessages(response.messages);
        setAuthors(response.authors);
        setScroll(true);
      } else {
        setEmpty(true);
      }
    },
    []
  );

  useEffect(() => {
    socketChat.on("server:getonselectmessages", listenerRoomMessages);
    socketChat.on("server:getmessages", listenerRoomMessages);
    return () => {
      socketChat.off("server:getonselectmessages", listenerRoomMessages);
      socketChat.off("server:getmessages", listenerRoomMessages);
    };
  }, [messages, listenerRoomMessages]);

  useEffect(() => {
    if (scroll === true) scrollToEnd();
  }, [scroll, scrollToEnd]);

  return (
    <div>
      {messages &&
        messages.map((element, key) => (
          <div
            className={
              authors[key] === props.user.name
                ? styles["message-own"]
                : styles["message"]
            }
            key={key}
            ref={scrollRef}
          >
            <div className={styles["messageTop"]}>
              <img
                className={styles["messageImg"]}
                src={getPathToImage("utilisateur")}
                alt="avatar"
              />
              <p className={styles["messageText"]}>{element.content}</p>
            </div>
            <div className={styles["messageBottom"]}>{`${timeAgo.format(
              new Date(element.created_at)
            )} - ${authors[key]}`}</div>
          </div>
        ))}
      {(!messages || empty === true) && <p>{"no message in the chat"}</p>}
    </div>
  );
}

export default Message;
