import styles from "./user-action.module.css";

/* eslint-disable-next-line */
export interface UserActionProps {}

export function UserAction(props: UserActionProps) {
  return (
    <ul className={styles["actionList"]}>
      <li className={styles["actionItem"]}>{"View Profile"}</li>
      <li className={styles["actionItem"]}>{"Add Friend"}</li>
      <li className={styles["actionItem"]}>{"Mute"}</li>
      <li className={styles["actionItem"]}>{"Mute in Room"}</li>
      <li className={styles["actionItem"]}>{"Ban from Room"}</li>
      <li className={styles["actionItem"]}>{"Grant admin"}</li>
      <li className={styles["actionItem"]}>{"Invite to play"}</li>
    </ul>
  );
}

export default UserAction;
