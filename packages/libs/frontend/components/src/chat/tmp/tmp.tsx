import ChatForms from "../chat-forms/chat-forms";
import CreateRoom from "../create-room/create-room";
import MessageInput from "../message-input/message-input";
import Message from "../message/message";
import Rooms from "../rooms/rooms";
import styles from "./tmp.module.css";

/* eslint-disable-next-line */
export interface TmpProps {}

export function Tmp(props: TmpProps) {
  return (
    <div className={styles["chat"]}>
      <div className={styles["chatRooms"]}>
        <div className={styles["chatRoomsWrapper"]}>
          <div className={styles["chatRoomsTop"]}>
            <Rooms />
          </div>
          <div className={styles["chatRoomsBottom"]}>
            <CreateRoom />
          </div>
        </div>
      </div>
      <div className={styles["chatBox"]}>
        <div className={styles["chatBoxWrapper"]}>
          <div className={styles["chatBoxTop"]}>
            <Message own={false} />
            <Message own={true} />
            <Message own={false} />
            <Message own={false} />
            <Message own={true} />
          </div>
          <div className={styles["chatBoxBottom"]}>
            <MessageInput />
          </div>
        </div>
      </div>
      <div className={styles["chatUsers"]}>
        <div className={styles["chatUsersWrapper"]}>Users List</div>
      </div>
    </div>
  );
}

export default Tmp;
