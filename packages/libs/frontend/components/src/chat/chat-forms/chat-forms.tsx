import styles from "./chat-forms.module.css";
import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useEffect, useState } from "react";

/* eslint-disable-next-line */
export interface ChatMessageFormsProps {}

export function ChatForms(props: ChatMessageFormsProps) {
  const [users, setUsers] = useState<UserDto[]>(undefined);

  const listenerUsers = (response: { users: UserDto[] }) => {
    if (response.users) {
      setUsers(response.users);
    }
  };

  useEffect(() => {
    socketChat.on("server:getroomusers", listenerUsers);
    socketChat.on("server:getusers", listenerUsers);
    return () => {
      socketChat.off("server:getroomusers", listenerUsers);
      socketChat.off("server:getusers", listenerUsers);
    };
  }, []);

  return !users ? null : (
    <form>
      <input
        placeholder="Search for user"
        type="text"
        list="data"
        className={styles["chatSearchInput"]}
      />

      <datalist id="data">
        {users.map((item, key) => (
          <option key={key} value={item.name} />
        ))}
      </datalist>
    </form>
  );
}

export default ChatForms;
