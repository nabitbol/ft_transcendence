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
    <div className={styles["auth_box"]}>
      <button className={styles["auth_btn"]} onClick={activateRoomForm}>
        Create a room
      </button>
      <br />
      {RoomFormState && <RoomForm />}
      {RoomFormState && <Backdrop closeBackdrop={desactivateForm} />}
    </div>
  );
}

export default CreateRoom;
