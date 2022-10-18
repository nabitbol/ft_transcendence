import classes from "./all-live-game.module.css";
import { LiveGame } from "../live-game/live-game";
import { SpectateInfo } from "@ft-transcendence/libs-shared-types";

export function AllLiveGame(props: { error: boolean, allGame: Array<SpectateInfo> }) {

  const allGame: Array<SpectateInfo> = props.allGame;
  const error: boolean = props.error;

  return (
    <div className={classes["spectate_container"]}>
      <span className={classes["span"]}>Live game</span>
      {error && (
        <span className={classes["nogame"]}>You cant spectate while playing !</span>
      )}
      {allGame.length === 0 && !error &&
        <span className={classes["nogame"]}>There is no game</span>
      }
      {allGame.length !== 0 && ! error &&
        <div className={classes["flex_container"]}>
          {allGame.length !== 0 && allGame.map((game: SpectateInfo) =>
          (
            <LiveGame game={game} key={game.id}/>
          ))}
        </div>
      }
    </div>
  );
}
