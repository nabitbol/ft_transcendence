import classes from "./spectate-game.module.css";
import { Backdrop, AllLiveGame } from "@ft-transcendence/libs-frontend-components";
import { Socket } from 'socket.io';
import { SocketContext } from '@ft-transcendence/libs-frontend-services';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Lobby } from "@ft-transcendence/libs/backend/game"

export function SpectateGame() {
  const navigate = useNavigate();
  const [specateOn, setSpecateOn] = useState<boolean>(false);
  const [allGame, setAllGame] = useState<Map<Lobby['id'], Lobby>>(undefined);
  const socket: Socket = useContext(SocketContext);

  function clickme_spectate_button() {
    setSpecateOn(true);
  }

  function clickme_close() {
    setSpecateOn(false);
  }

  const listenerLobbyList = (data) => {
    setAllGame(data.lobbies);
  }

  useEffect(() => {
    socket.on('server.lobbylist', listenerLobbyList);
    socket.emit('client.lobbylist');
    return () => {
      socket.off('server.lobbylist', listenerLobbyList);
    };
  }, [navigate, socket]);

  return !allGame ? null : (
    <div>
      {specateOn && (
        <div>
          <Backdrop closeBackdrop={clickme_close} />
          <AllLiveGame allGame={allGame} />
        </div>
      )}
      <button
        className={classes['button_spectate']}
        onClick={clickme_spectate_button}
      >
        Spectate Game
      </button>
    </div>
  );
}
