import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { useRef, useState } from "react";
import styles from "./user-list.module.css";

/* eslint-disable-next-line */
export interface UserListProps {}

export function UserList(props: UserListProps) {
  const [userAction, setUserAction] = useState<string>("userActionDown");
  const [userActionList, setUserActionList] = useState<boolean>(false);
  const actionRef = useRef<HTMLDivElement>(null);

  const openUserActionList = (state: boolean) => {
    setUserActionList(!state);
    setUserAction((cur) =>
      cur === "userActionDown" ? "userActionUp" : "userActionDown"
    );
  };
  const handleClickOutsideActionList = (e) => {
    if (
      userActionList &&
      userAction === "userActionUp" &&
      !actionRef.current?.contains(e.target as Node)
    ) {
      setUserActionList(false);
      setUserAction("userActionDown");
    }
  };
  window.addEventListener("click", handleClickOutsideActionList);

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
        <div className={styles["actionContainer"]} ref={actionRef}>
          <span
            className={styles[userAction]}
            onClick={(e) => openUserActionList(userActionList)}
          ></span>
          <div>
            {userActionList && (
              <ul className={styles["actionList"]}>
                <li className={styles["actionItem"]}>item1</li>
                <li className={styles["actionItem"]}>item2</li>
                <li className={styles["actionItem"]}>item3</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
