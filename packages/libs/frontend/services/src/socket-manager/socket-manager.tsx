import { io } from "socket.io-client";
import React from "react";
import authHeader from "../auth-header/auth-header";

const config = {
  extraHeaders: authHeader(), 
};

export const socketChat = io("ws://localhost:8080", config);
export const socketGame = io("ws://localhost:3030", config);
export const SocketChatContext = React.createContext(undefined);
export const SocketGameContext = React.createContext(undefined);
