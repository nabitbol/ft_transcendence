import { socketChat, SocketGameContext } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { Room_Role } from "@prisma/client";
import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io";
import styles from "./user-action.module.css";

/* eslint-disable-next-line */
export interface UserActionProps {
  user: UserDto;
}

export function UserAction(props: UserActionProps) {
  const navigate = useNavigate();
  const socket: Socket = useContext(SocketGameContext);

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

  const createConversation = async () => {
    const Data = {
      user: props.user,
    };
    socketChat.emit("client:createconversation", Data);
  };

  const inviteInPrivateRoom = async () => {
    const Data = {
      user: props.user,
    };
    socketChat.emit("client:addinprivateroom", Data);
  };

  const inviteToPlay = async () => {
    socket.emit("client.lobbyinvite", props.user.name);
  };

  const listenerUpdateUseRole = (response: { res }) => {
    if (response.res) alert(response.res);
  };

  const updateUserRole = (newRole: Room_Role) => {
    const Data = {
      user: props.user,
      newRole: newRole,
    };
    socketChat.emit("client:updateuserrole", Data);
  };

  const listenerGameStart = useCallback(() => {
    navigate("/game");
  }, [navigate]);

  useEffect(() => {
    socket.on("exception", listenerActionError);
    socket.on("server.gamestart", listenerGameStart);
    socketChat.on("exception", listenerActionError);
    socketChat.on("server:updateuserrole", listenerUpdateUseRole);
    socketChat.on("server:addinprivateroom", listenerUpdateUseRole);
    return () => {
      socket.off("exception", listenerActionError);
      socket.off("server.gamestart", listenerGameStart);
      socketChat.off("server:addinprivateroom", listenerUpdateUseRole);
      socketChat.off("server:updateuserrole", listenerUpdateUseRole);
      socketChat.off("exception", listenerActionError);
    };
  }, [listenerActionError, listenerGameStart, socket]);

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
      <li
        className={styles["actionItem"]}
        onClick={(e) => inviteToPlay()}
      >
        {"Invite to play"}
      </li>
      <li
        className={styles["actionItem"]}
        onClick={(e) => createConversation()}
      >
        {"Create conversation"}
      </li>
      <li
        className={styles["actionItem"]}
        onClick={(e) => inviteInPrivateRoom()}
      >
        {"Add in private room"}
      </li>
    </ul>
  );
}

export default UserAction;
