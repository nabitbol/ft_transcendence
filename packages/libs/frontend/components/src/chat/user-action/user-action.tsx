import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { Room_Role } from "@prisma/client";
import { useCallback, useEffect } from "react";
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

  const blockUser = async (e) => {
    const Data = {
      user: props.user,
    };
    socketChat.emit("client:blockuser", Data);
    alert("Blocked: " + props.user.name);
  };

  const unBlockUser = async (e) => {
    const Data = {
      user: props.user,
    };
    socketChat.emit("client:unblockuser", Data);
    alert("Unblocked: " + props.user.name);
  };

  const listenerActionError = useCallback((err) => {
    alert(err.message);
  }, []);

  const createConversation = async (e) => {
    socketChat.emit("client:createconversation", props.user);
  };

  const listenerUpdateUseRole = (response: { res }) => {
    if (response.res) alert(response.res);
  };

  const updateUserRole = (newRole: Room_Role) => {
    const Data = {
      user: props.user,
      newRole: newRole,
    };
    console.log(newRole);
    socketChat.emit("client:updateuserrole", Data);
  };

  useEffect(() => {
    socketChat.on("exception", listenerActionError);
    socketChat.on("server:updateuserrole", listenerUpdateUseRole);
    return () => {
      socketChat.off("server:updateuserrole", listenerUpdateUseRole);
      socketChat.off("exception", listenerActionError);
    };
  }, [listenerActionError]);

  return (
    <ul className={styles["actionList"]}>
      <li
        className={styles["actionItem"]}
        onClick={(e) => navigateToProfile(e)}
      >
        {"View Profile"}
      </li>
      <li className={styles["actionItem"]} onClick={(e) => blockUser(e)}>
        {"Block"}
      </li>
      <li className={styles["actionItem"]} onClick={(e) => unBlockUser(e)}>
        {"Unblock"}
      </li>
      <li
        className={styles["actionItem"]}
        onClick={() => updateUserRole(Room_Role.MUTED)}
      >
        {"Mute in Room"}
      </li>
      <li
        className={styles["actionItem"]}
        onClick={() => updateUserRole(Room_Role.BANNED)}
      >
        {"Ban from Room"}
      </li>
      <li
        className={styles["actionItem"]}
        onClick={() => updateUserRole(Room_Role.ADMIN)}
      >
        {"Grant admin"}
      </li>
      <li className={styles["actionItem"]}>{"Invite to play"}</li>
      <li
        className={styles["actionItem"]}
        onClick={(e) => createConversation(e)}
      >
        {"Create conversation"}
      </li>
    </ul>
  );
}

export default UserAction;
