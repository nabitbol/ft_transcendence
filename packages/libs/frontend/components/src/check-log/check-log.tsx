import { AuthReq, SocketGameContext } from '@ft-transcendence/libs-frontend-services';
import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from "socket.io";

export function CheckLog() {
  const navigate = useNavigate();
  const socket: Socket = useContext(SocketGameContext);

  const listenerDoubleLog = useCallback(() => {
    AuthReq.logout();
    navigate("/");
    window.location.reload();
  }, [navigate]);

  useEffect(() => {
    socket.on("server.doublelog", listenerDoubleLog);
    return () => {
      socket.off("server.doublelog", listenerDoubleLog);
    };
  }, [socket, listenerDoubleLog]);

  return null;
};


export default CheckLog;
