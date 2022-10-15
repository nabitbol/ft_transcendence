import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import styles from "./message.module.css";

/* eslint-disable-next-line */
export interface MessageProps {
  own: boolean;
}

export function Message(props: MessageProps) {
  return (
    <div className={props.own ? styles["message-own"] : styles["message"]}>
      <div className={styles["messageTop"]}>
        <img
          className={styles["messageImg"]}
          src={getPathToImage("utilisateur")}
          alt="avatar"
        />
        <p className={styles["messageText"]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <div className={styles["messageBottom"]}>1 hour ago</div>
    </div>
  );
}

export default Message;
