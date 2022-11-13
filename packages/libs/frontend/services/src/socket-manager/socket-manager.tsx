import { io } from "socket.io-client";
import React from "react";
import authHeader from "../auth-header/auth-header";

const config = {
  extraHeaders: authHeader(), 
};

export const socketGame = io(`ws://${process.env['NX_HOST_NAME']}:${process.env['NX_SOCKET_GAME']}`, config);
export const socketChat = io(`ws://${process.env['NX_HOST_NAME']}:${process.env['NX_SOCKET_CHAT']}`, config);
export const SocketGameContext = React.createContext(undefined);
export const SocketChatContext = React.createContext(undefined);
