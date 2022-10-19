import { useState } from "react";
import { Backdrop } from "../../layout/backdrop/backdrop";
import CreateRoom from "../create-room/create-room";
import JoinRoom from "../join-room/join-room";
import LeaveRoom from "../leave-room/leave-room";
import styles from "./rooms-button.module.css";

/* eslint-disable-next-line */
export interface RoomsButtonProps {}

export function RoomsButton(props: RoomsButtonProps) {
  const [createFormState, setCreateForm] = useState(false);
  const [joinFormState, setJoinForm] = useState(false);
  const [leaveFormState, setLeaveForm] = useState(false);

  const desactivateForm = () => {
    setJoinForm(false);
    setCreateForm(false);
    setLeaveForm(false);
  };

  const activateCreateForm = () => {
    desactivateForm();
    setCreateForm(true);
  };

  const activateJoinForm = () => {
    desactivateForm();
    setJoinForm(true);
  };

  const activateLeaveForm = () => {
    desactivateForm();
    setLeaveForm(true);
  };

  return (
    <div className={styles["roomActions"]}>
      <div className={styles["createRoomBox"]}>
        <button
          className={styles["createRoomButton"]}
          onClick={activateCreateForm}
        >
          Create room
        </button>
        <br />
        {createFormState && <CreateRoom />}
        {createFormState && <Backdrop closeBackdrop={desactivateForm} />}
      </div>
      <div className={styles["createRoomBox"]}>
        <button
          className={styles["createRoomButton"]}
          onClick={activateJoinForm}
        >
          Join room
        </button>
        <br />
        {joinFormState && <JoinRoom />}
        {joinFormState && <Backdrop closeBackdrop={desactivateForm} />}
      </div>
      <div className={styles["createRoomBox"]}>
        <button
          className={styles["createRoomButton"]}
          onClick={activateLeaveForm}
        >
          Leave room
        </button>
        <br />
        {leaveFormState && <LeaveRoom />}
        {leaveFormState && <Backdrop closeBackdrop={desactivateForm} />}
      </div>
    </div>
  );
}

export default RoomsButton;
