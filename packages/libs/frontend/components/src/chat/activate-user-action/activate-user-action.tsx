import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useRef, useState } from "react";
import UserAction from "../user-action/user-action";
import styles from "./activate-user-action.module.css";

/* eslint-disable-next-line */
export interface ActivateUserActionProps {
  user: UserDto;
}

export function ActivateUserAction(props: ActivateUserActionProps) {
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
    <div className={styles["actionContainer"]} ref={actionRef}>
      <span
        className={styles[userAction]}
        onClick={(e) => openUserActionList(userActionList)}
      ></span>
      <div>{userActionList && <UserAction user={props.user} />}</div>
    </div>
  );
}

export default ActivateUserAction;
