import styles from "./chat-forms.module.css";
import { Chat } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* eslint-disable-next-line */
export interface ChatMessageFormsProps {
  roomName: string;
}

export function ChatForms(props: ChatMessageFormsProps) {
  const [users, setUsers] = useState<UserDto[]>(undefined);
  const navigate = useNavigate();

  const GetUsersInRoom = async () => {
    try {
      const response: UserDto[] = await Chat.requestRoomUsers(props.roomName);
      setUsers(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    GetUsersInRoom();
  }, []);

  return (
    <form>
      <input
        placeholder="Search for user"
        type="text"
        list="data"
        className={styles[".chatSearchInput"]}
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
