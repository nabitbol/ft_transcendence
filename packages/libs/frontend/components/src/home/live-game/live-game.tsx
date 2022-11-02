import classes from "./live-game.module.css";
import { SpectateInfo } from "@ft-transcendence/libs-shared-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from '@ft-transcendence/libs-frontend-services';
import { Socket } from 'socket.io';

export function LiveGame(props: { game: SpectateInfo }) {
  const navigate = useNavigate();
  const game: SpectateInfo = props.game;
  const socket: Socket = useContext(SocketContext);

  function spectate() {
    socket.emit('client.spectate', props.game.id);
    navigate("/game");
  }

  return (
    <div>
      <div className={classes["main_container"]}>
        <span className={classes["span"]}>{game.left}</span>
        <div className={classes["middle_container"]}>
          <span className={classes["span_title"]}>{game.game_mode}</span>
          <button
            className={classes['button_spectate']}
            onClick={spectate}
          >
            Spectate
          </button>
        </div>
        <span className={classes["span"]}>{game.right}</span>
      </div>
    </div>
  );
}
