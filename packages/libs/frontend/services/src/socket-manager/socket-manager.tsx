import * as React from "react";
import { io } from "socket.io-client";
import authHeader from "../auth-header/auth-header";

const config = {
  extraHeaders: authHeader(),
};

export const socketChat = io("ws://localhost:5555", config);
export const SocketContext = React.createContext(undefined);
