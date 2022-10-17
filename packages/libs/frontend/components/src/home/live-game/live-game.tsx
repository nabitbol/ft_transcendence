import classes from "./live-game.module.css";
import { Lobby } from "@ft-transcendence/libs/backend/game"

export function LiveGame(props: { game: Lobby }) {

  const game: Lobby = props.game;
  console.log("Game = " + game);

  return (
    <div className={classes["div"]}>
    </div>
  );
}
