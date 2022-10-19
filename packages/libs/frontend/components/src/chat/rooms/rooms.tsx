import { SocketContext } from "@ft-transcendence/libs-frontend-services";
import { RoomDto } from "@ft-transcendence/libs-shared-types";
import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "./rooms.module.css";

/* eslint-disable-next-line */
export interface RoomsProps {}

export function Rooms(props: RoomsProps) {
  const [rooms, setRooms] = useState<RoomDto[]>(undefined);
  const [user_roles, setUserRoomsRoles] = useState<string[]>(undefined);
  const socket: Socket = useContext(SocketContext);

  const listenerUserRooms = (response: {
    rooms: RoomDto[];
    userRole: string[];
  }) => {
    setUserRoomsRoles(response.userRole);
    setRooms(response.rooms);
  };

  useEffect(() => {
    socket.on("server:getuserrooms", listenerUserRooms);
    socket.on("server:createroom", listenerUserRooms);
    socket.emit("client:getuserrooms");
    return () => {
      socket.off("server:getuserrooms", listenerUserRooms);
      socket.off("server:createroom", listenerUserRooms);
    };
  }, [socket]);

  return !rooms && !user_roles ? null : (
    <div className={styles["roomList"]}>
      {rooms.map((element, key) => (
        <div className={styles["roomLine"]} title={user_roles[key]} key={key}>
          <p className={styles["roomName"]}>{element.name}</p>
          <p className={styles["roomStatus"]}>
            {element.status.toString().toLowerCase()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Rooms;
