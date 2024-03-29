import ChatForms from "../chat-forms/chat-forms";
import MessageInput from "../message-input/message-input";
import Message from "../message/message";
import Rooms from "../rooms/rooms";
import styles from "./chat.module.css";
import ReactSwitch from "react-switch";
import { useCallback, useEffect, useState } from "react";
import UserList from "../user-list/user-list";
import RoomsButton from "../rooms-button/rooms-button";
import { socketChat } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";

/* eslint-disable-next-line */
export interface ChatProps {}

export function Chat(props: ChatProps) {
  const toggleOnColor = "#d3046b";
  const [userTypeList, setUserTypeList] = useState("All");
  const [usersCount, setUsersCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserDto>();
  const navigate = useNavigate();

  const getUserData = useCallback(async () => {
    try {
      const response: UserDto = await User.requestUserInfoForChat();
      setUserData(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate]);

  const toggleTypeList = () => {
    if (userTypeList === "All") {
      setUserTypeList("Room");
      socketChat.emit("client:getroomusers");
    }
    if (userTypeList === "Room") {
      setUserTypeList("All");
      socketChat.emit("client:getusers");
    }
  };

  const listenerUsers = (response: { users: UserDto[]; status: string[] }) => {
    setUsersCount(response.users.length);
  };

  useEffect(() => {
    socketChat.on("server:getroomusers", listenerUsers);
    socketChat.on("server:getusers", listenerUsers);
    socketChat.on("server:searchuser", listenerUsers);
    socketChat.emit("client:getusers");
    return () => {
      socketChat.off("server:getusers", listenerUsers);
      socketChat.off("server:getroomusers", listenerUsers);
      socketChat.off("server:searchuser", listenerUsers);
    };
  }, []);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <div className={styles["chat"]}>
      <div className={styles["chatRooms"]}>
        <div className={styles["chatRoomsWrapper"]}>
          <div className={styles["chatRoomsTop"]}>
            <Rooms />
          </div>
          <div className={styles["chatRoomsBottom"]}>
            <RoomsButton />
          </div>
        </div>
      </div>
      <div className={styles["chatBox"]}>
        <div className={styles["chatBoxWrapper"]}>
          <div className={styles["chatBoxTop"]}>
            <Message user={userData} />
          </div>
          <div className={styles["chatBoxBottom"]}>
            <MessageInput />
          </div>
        </div>
      </div>
      <div className={styles["chatUsers"]}>
        <div className={styles["chatUsersWrapper"]}>
          <div className={styles["chatUsersTop"]}>
            <div className={styles["chatUsersFilter"]}>
              <div className={styles["chatUsersFilterTop"]}>
                <div className={styles["toggleFilter"]}>
                  <ReactSwitch
                    onChange={toggleTypeList}
                    checked={userTypeList === "Room"}
                    onColor={toggleOnColor}
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                  <label className={styles["toggleLabel"]}>
                    {userTypeList}
                  </label>
                </div>
                <span className={styles["userNumber"]}>
                  {usersCount + " Users"}
                </span>
              </div>
              <div className={styles["chatUsersFilterBottom"]}>
                <ChatForms userTypeList={userTypeList} />
              </div>
            </div>
          </div>
          <div className={styles["chatUsersBottom"]}>
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
