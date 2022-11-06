import { SocketGameContext } from '@ft-transcendence/libs-frontend-services';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from "socket.io";
import { GameInvitationForm } from './game-invitation-form/game-invitation-form';

export function GameInvitation() {
  const navigate = useNavigate();
  const socket: Socket = useContext(SocketGameContext);
  const [RoomCode, setRoomCode] = useState<string>(undefined);

  const listenerLobbyInvite =(data) => {
    setRoomCode(data);
  };

  const listenerActionError = (err) => {
    alert(err.message);
  };

  const acceptInvitation = () => {
    socket.emit("client.acceptinvite", RoomCode);
  };

  const cancelInvitation = () => {
    socket.emit("client.cancelinvite", RoomCode);
  };

  const listenerGameStart = useCallback(() => {
    navigate("/game");
  }, [navigate]);

  const closeModal = () => {
    cancelInvitation();
    setRoomCode(undefined);
  };

  useEffect(() => {
    console.log("in effect");
    socket.on("server.gamestart", listenerGameStart);
    socket.on("server.lobbyinvite", listenerLobbyInvite);
    socket.on("exception", listenerActionError);
    return () => {
      socket.off("server.gamestart", listenerGameStart);
      socket.off("server.lobbyinvite", listenerLobbyInvite);
      socket.off("exception", listenerActionError);
    };
  }, [socket, listenerGameStart]);

  return !RoomCode ? null : (
    <GameInvitationForm acceptInvitation={acceptInvitation} closeModal={closeModal} />
  );
};


export default GameInvitation;
