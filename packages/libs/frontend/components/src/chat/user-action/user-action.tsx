import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useNavigate } from "react-router-dom";
import styles from "./user-action.module.css";

/* eslint-disable-next-line */
export interface UserActionProps {
  user: UserDto;
}

export function UserAction(props: UserActionProps) {
  const navigate = useNavigate();
  const navigateToProfile = async (e) => {
    navigate("/profile/" + props.user.name);
    e.preventDefault();
  };
  return (
    <ul className={styles["actionList"]}>
      <li
        className={styles["actionItem"]}
        onClick={(e) => navigateToProfile(e)}
      >
        {"View Profile"}
      </li>
      <li className={styles["actionItem"]}>{"Add Friend"}</li>
      <li className={styles["actionItem"]}>{"Mute"}</li>
      <li className={styles["actionItem"]}>{"Mute in Room"}</li>
      <li className={styles["actionItem"]}>{"Ban from Room"}</li>
      <li className={styles["actionItem"]}>{"Grant admin"}</li>
      <li className={styles["actionItem"]}>{"Invite to play"}</li>
      <li className={styles["actionItem"]}>{"Send message"}</li>
    </ul>
  );
}

export default UserAction;
