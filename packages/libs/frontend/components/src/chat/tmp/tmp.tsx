import ChatForms from "../chat-forms/chat-forms";
import Rooms from "../rooms/rooms";
import styles from "./tmp.module.css";

/* eslint-disable-next-line */
export interface TmpProps {}

export function Tmp(props: TmpProps) {
  return (
    <div className={styles["chat"]}>
      <div className={styles["chatRooms"]}>
        <div className={styles["chatRoomsWrapper"]}>
          <Rooms />
        </div>
      </div>
      <div className={styles["chatBox"]}>
        <div className={styles["chatBoxWrapper"]}>toto</div>
      </div>
      <div className={styles["chatRoom"]}>
        <div className={styles["chatRoomWrapper"]}></div>
      </div>
    </div>
  );
}

export default Tmp;
