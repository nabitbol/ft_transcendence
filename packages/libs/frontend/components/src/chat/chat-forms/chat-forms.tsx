import styles from "./chat-forms.module.css";
import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useEffect, useRef, useState } from "react";

/* eslint-disable-next-line */
export interface ChatMessageFormsProps {
  userTypeList: string;
}

export function ChatForms(props: ChatMessageFormsProps) {
  const [users, setUsers] = useState<UserDto[]>(null);
  const [userName, setUserName] = useState<string>(undefined);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const payload = {
      contains: inputRef?.current.value,
      list: users,
    };
    if (payload.contains === "") {
      if (props.userTypeList === "All") socketChat.emit("client:getusers");
      if (props.userTypeList === "Room") socketChat.emit("client:getroomusers");
    } else {
      socketChat.emit("client:searchuser", payload);
    }
    event.preventDefault();
  };

  const listenerUsers = (response: { users: UserDto[]; status: string[] }) => {
    if (response.users) {
      setUsers(response.users);
    }
  };

  useEffect(() => {
    socketChat.on("server:getroomusers", listenerUsers);
    socketChat.on("server:getusers", listenerUsers);
    socketChat.on("server:searchuser", listenerUsers);
    return () => {
      socketChat.off("server:getroomusers", listenerUsers);
      socketChat.off("server:getusers", listenerUsers);
      socketChat.off("server:searchuser", listenerUsers);
    };
  }, []);

  return (
    <div>
      <input
        placeholder="Search for user"
        type="text"
        list="data"
        className={styles["chatSearchInput"]}
        value={userName}
        onChange={(e) => handleChange(e)}
        ref={inputRef}
      />

      {users && (
        <datalist id="data">
          {users.map((item, key) => (
            <option key={key} value={item.name} />
          ))}
        </datalist>
      )}
    </div>
  );
}

export default ChatForms;
