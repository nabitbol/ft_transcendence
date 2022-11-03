import classes from "./spectate-game.module.css";
import {
  Backdrop,
  AllLiveGame,
} from "@ft-transcendence/libs-frontend-components";
import { Socket } from "socket.io";
import { SocketGameContext } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { SpectateInfo } from "@ft-transcendence/libs-shared-types";

export function SpectateGame() {
  const navigate = useNavigate();
  const [allGame, setAllGame] = useState<Array<SpectateInfo>>(undefined);
  const [error, setError] = useState(false);
  const socket: Socket = useContext(SocketGameContext);

  function clickme_spectate_button() {
    setError(false);
    socket.emit("client.lobbylist");
    setAllGame(Array<SpectateInfo>());
  }

  function clickme_close() {
    setAllGame(undefined);
  }

  const listenerException = (error) => {
    console.log("IN ERROR SPECTATE");
    setError(true);
  };

  const listenerLobbyList = (data: { lobbies: Array<SpectateInfo> }) => {
    setAllGame(data.lobbies);
  };

  useEffect(() => {
    socket.on("server.lobbylist", listenerLobbyList);
    socket.on("exception", listenerException);
    return () => {
      socket.off("server.lobbylist", listenerLobbyList);
      socket.off("exception", listenerException);
    };
  }, [navigate, socket]);

  return (
    <div>
      {allGame && (
        <div>
          <Backdrop closeBackdrop={clickme_close} />
          <AllLiveGame error={error} allGame={allGame} />
        </div>
      )}
      <button
        className={classes["button_spectate"]}
        onClick={clickme_spectate_button}
      >
        Spectate Game
      </button>
    </div>
  );
}
