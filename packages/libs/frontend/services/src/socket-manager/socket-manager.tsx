import { io } from "socket.io-client";
import React from 'react';
import authHeader from "../auth-header/auth-header";

const config = {
    extraHeaders: authHeader(),
  };

export const socket = io("ws://localhost:3030", config);
export const SocketContext = React.createContext(undefined);