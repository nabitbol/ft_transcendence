import styles from "./tmp.module.css";

/* eslint-disable-next-line */
export interface TmpProps {}

export function Tmp(props: TmpProps) {
  return (
    <div className={styles["chat"]}>
      <div className={styles["chatRooms"]}>
        <div className={styles["chatRoomsWrapper"]}>bob</div>
      </div>
      <div className={styles["chatBox"]}>
        <div className={styles["chatBoxWrapper"]}>toto</div>
      </div>
      <div className={styles["chatRoom"]}>
        <div className={styles["chatRoomWrapper"]}>coco</div>
      </div>
    </div>
  );
}

export default Tmp;
