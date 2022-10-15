import { io } from "socket.io-client";
import React from 'react';

export const socket = io("ws://localhost:3030");
export const SocketContext = React.createContext(undefined);