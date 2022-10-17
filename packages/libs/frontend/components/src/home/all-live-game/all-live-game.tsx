import classes from "./all-live-game.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { Lobby } from "@ft-transcendence/libs/backend/game"
import { LiveGame } from "../live-game/live-game";

export function AllLiveGame(props: { allGame: Map<Lobby['id'], Lobby> }) {

  const allGame: Map<Lobby['id'], Lobby> = props.allGame;
  console.log(allGame);
  return (
    <div className={classes["div"]}>
                  {
            [...allGame.values()].map((game: Lobby) => 
            (
              <LiveGame game={game} />
            ))
            }
    </div>
  );
}
