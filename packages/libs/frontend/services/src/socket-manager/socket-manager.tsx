import * as React from "react";
import { io } from "socket.io-client";
import authHeader from "../auth-header/auth-header";

const config = {
  extraHeaders: authHeader(),
};

export const socketChat = io("ws://localhost:8080", config);
export const SocketContext = React.createContext(undefined);
