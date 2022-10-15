import { useState } from "react";
import { Backdrop } from "../../layout/backdrop/backdrop";
import { RoomForm } from "../room-form/room-form";
import styles from "./create-room.module.css";

/* eslint-disable-next-line */
export interface CreateRoomProps {}

export function CreateRoom(props: CreateRoomProps) {
  const [RoomFormState, setRoomForm] = useState(false);

  const desactivateForm = () => {
    setRoomForm(false);
  };

  const activateRoomForm = () => {
    desactivateForm();
    setRoomForm(true);
  };

  return (
    <div className={styles["roomActions"]}>
      <div className={styles["createRoomBox"]}>
        <button
          className={styles["createRoomButton"]}
          onClick={activateRoomForm}
        >
          Create room
        </button>
        <br />
        {RoomFormState && <RoomForm />}
        {RoomFormState && <Backdrop closeBackdrop={desactivateForm} />}
      </div>
      <div className={styles["createRoomBox"]}>
        <button
          className={styles["createRoomButton"]}
          onClick={activateRoomForm}
        >
          Join room
        </button>
        <br />
        {RoomFormState && <RoomForm />}
        {RoomFormState && <Backdrop closeBackdrop={desactivateForm} />}
      </div>
      <div className={styles["createRoomBox"]}>
        <button
          className={styles["createRoomButton"]}
          onClick={activateRoomForm}
        >
          Leave room
        </button>
        <br />
        {RoomFormState && <RoomForm />}
        {RoomFormState && <Backdrop closeBackdrop={desactivateForm} />}
      </div>
    </div>
  );
}

export default CreateRoom;
