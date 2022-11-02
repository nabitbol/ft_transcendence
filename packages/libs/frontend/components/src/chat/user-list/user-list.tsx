import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useCallback, useEffect, useRef, useState } from "react";
import ActivateUserAction from "../activate-user-action/activate-user-action";
import styles from "./user-list.module.css";

/* eslint-disable-next-line */
export interface UserListProps {}

export function UserList(props: UserListProps) {
  const [scroll, setScroll] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDto[]>(null);
  const [status, setStatus] = useState<string[]>(undefined);
  const [erroMessage, setMessage] = useState<string>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    setScroll(false);
  }, []);

  const listenerUpdateErrorMessage = useCallback((err) => {
    setMessage(err.erroMessage);
  }, []);

  const listenerUsers = (response: { users: UserDto[]; status: string[] }) => {
    if (response.users) {
      setUsers(response.users);
      setStatus(response.status);
      setMessage(null);
      setScroll(true);
    }
  };

  useEffect(() => {
    socketChat.on("server:getroomusers", listenerUsers);
    socketChat.on("server:getusers", listenerUsers);
    socketChat.on("server:searchuser", listenerUsers);
    socketChat.on("exception", listenerUpdateErrorMessage);
    return () => {
      socketChat.off("server:getroomusers", listenerUsers);
      socketChat.off("server:getusers", listenerUsers);
      socketChat.off("server:searchuser", listenerUsers);
      socketChat.off("exception", listenerUpdateErrorMessage);
    };
  }, [listenerUpdateErrorMessage]);

  useEffect(() => {
    if (scroll === true) scrollToEnd();
  }, [scroll, scrollToEnd]);

  return (
    <div className={styles["userList"]}>
      {erroMessage && <p className={styles["errorMessage"]}>{erroMessage}</p>}
      {!erroMessage &&
        users &&
        users.map((element, key) => (
          <div className={styles["userLine"]} key={key}>
            <div className={styles["userInfos"]}>
              <div className={styles["userImgContainer"]}>
                <img
                  className={styles["userImg"]}
                  src={getPathToImage(element.image)}
                  alt="avatar"
                />
                <div
                  className={
                    status[key] === "online"
                      ? styles["userBadgeOnline"]
                      : styles["userBadgeOffline"]
                  }
                ></div>
              </div>
              <span className={styles["userName"]}>{element.name}</span>
            </div>
            <ActivateUserAction user={element} />
          </div>
        ))}
    </div>
  );
}

export default UserList;
