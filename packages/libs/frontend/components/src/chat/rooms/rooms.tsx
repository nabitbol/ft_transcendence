import { SocketContext } from "@ft-transcendence/libs-frontend-services";
import { RoomDto } from "@ft-transcendence/libs-shared-types";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "./rooms.module.css";

/* eslint-disable-next-line */
export interface RoomsProps {}

export function Rooms(props: RoomsProps) {
  const [rooms, setRooms] = useState<RoomDto[]>(undefined);
  const [scroll, setScroll] = useState<boolean>(false);
  const [user_roles, setUserRoomsRoles] = useState<string[]>(undefined);
  const socket: Socket = useContext(SocketContext);
  const scrollRef = useRef(null);

  const selectRoom = (room: RoomDto) => {
    socket.emit("client:selectroom", room.name);
  };

  const listenerUserRooms = (response: {
    rooms: RoomDto[];
    userRole: string[];
  }) => {
    setUserRoomsRoles(response.userRole);
    setRooms(response.rooms);
  };

  const listenerUserRoomsScroll = (response: {
    rooms: RoomDto[];
    userRole: string[];
  }) => {
    setUserRoomsRoles(response.userRole);
    setRooms(response.rooms);
    setScroll(true);
  };

  const scrollToEnd = useCallback(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    setScroll(false);
  }, []);

  useEffect(() => {
    socket.on("server:getuserrooms", listenerUserRooms);
    socket.on("server:createroom", listenerUserRoomsScroll);
    socket.on("server:joinroom", listenerUserRoomsScroll);
    socket.on("server:leaveroom", listenerUserRooms);
    socket.emit("client:getuserrooms");
    return () => {
      socket.off("server:getuserrooms", listenerUserRooms);
      socket.off("server:createroom", listenerUserRoomsScroll);
      socket.off("server:joinroom", listenerUserRoomsScroll);
      socket.off("server:leaveroom", listenerUserRooms);
    };
  }, [socket]);

  useEffect(() => {
    if (scroll === true) scrollToEnd();
  }, [scroll, scrollToEnd]);

  return !rooms && !user_roles ? null : (
    <div className={styles["roomList"]}>
      {rooms.map((element, key) => (
        <div
          className={styles["roomLine"]}
          title={user_roles[key]}
          key={key}
          ref={scrollRef}
          onClick={(e) => selectRoom(element)}
        >
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
