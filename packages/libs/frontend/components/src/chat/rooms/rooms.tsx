import { Chat } from "@ft-transcendence/libs-frontend-services";
import { RoomDto } from "@ft-transcendence/libs-shared-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./rooms.module.css";

/* eslint-disable-next-line */
export interface RoomsProps {}

export function Rooms(props: RoomsProps) {
  const [rooms, setRooms] = useState<RoomDto[]>(undefined);
  const navigate = useNavigate();

  const GetUserRooms = async () => {
    try {
      const response: RoomDto[] = await Chat.requestUserRooms();
      console.log(response);
      setRooms(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    GetUserRooms();
  }, []);

  return !rooms ? null : (
    <div className={styles["rooms"]}>
      <ul>
        {rooms.map((element) => (
          <li>
            {element.name} {element.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;
