import ChatForms from "../chat-forms/chat-forms";
import CreateRoom from "../create-room/create-room";
import MessageInput from "../message-input/message-input";
import Message from "../message/message";
import Rooms from "../rooms/rooms";
import styles from "./tmp.module.css";
import ReactSwitch from "react-switch";
import { useState } from "react";
import UserList from "../user-list/user-list";
import RoomsButton from "../rooms-button/rooms-button";

/* eslint-disable-next-line */
export interface TmpProps {}

export function Tmp(props: TmpProps) {
  const toggleOnColor = "#d3046b";
  const [userTypeList, setUserTypeList] = useState("Room");

  const toggleTypeList = () => {
    setUserTypeList((cur) => (cur === "All" ? "Room" : "All"));
  };

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
            <Message own={false} />
            <Message own={true} />
            <Message own={false} />
            <Message own={false} />
            <Message own={true} />
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
                <span className={styles["userNumber"]}>{"12 Users"}</span>
              </div>
              <div className={styles["chatUsersFilterBottom"]}>
                <ChatForms roomName={"room1"} />
              </div>
            </div>
          </div>
          <div className={styles["chatUsersBottom"]}>
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tmp;
