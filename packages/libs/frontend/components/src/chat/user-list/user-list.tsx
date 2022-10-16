import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { useState } from "react";
import styles from "./user-list.module.css";

/* eslint-disable-next-line */
export interface UserListProps {}

export function UserList(props: UserListProps) {
  const [userAction, setUserAction] = useState("userActionDown");

  const switchUserAction = () => {
    setUserAction((cur) =>
      cur === "userActionDown" ? "userActionUp" : "userActionDown"
    );
  };
  return (
    <div className={styles["userList"]}>
      <div className={styles["userLine"]}>
        <div className={styles["userInfos"]}>
          <div className={styles["userImgContainer"]}>
            <img
              className={styles["userImg"]}
              src={getPathToImage("utilisateur")}
              alt="avatar"
            />
            <div className={styles["userBadge"]}></div>
          </div>
          <span className={styles["userName"]}>{"nabitbol"}</span>
        </div>
        <span className={styles[userAction]} onClick={switchUserAction}></span>
      </div>
    </div>
  );
}

export default UserList;
