import classes from "./past-game.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { MatchDto } from "@ft-transcendence/libs-shared-types";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";

export function PastGame(props: { game_info: MatchDto }) {
  const name = props.game_info.winner;
  const score = props.game_info.winnerScore;
  const name_j2 = props.game_info.looser
  const score_j2 = props.game_info.looserScore;
  return (
    <div className={classes["main_container"]}>
      <div className={classes["left_side"]}>
        <div className={classes["fpile"]}>
          <div className={classes["div_j1"]}>
            <img
              src={getPathToImage("friend")}
              height="50"
              width="50"
              className={classes["img_j1"]}
              alt="player"
            />
          </div>
          <span className={classes["span"]}>{name}</span>
        </div>
        <span className={classes["span"]}>Loser</span>
        <span className={classes["span"]}>{score}</span>
      </div>

      <div className={classes["right_side"]}>
        <span className={classes["span"]}>{score_j2}</span>
        <span className={classes["span"]}>Winner</span>
        <div className={classes["fpile"]}>
          <div className={classes["div_j1"]}>
            <img
              src={getPathToImage("friend")}
              height="50"
              width="50"
              className={classes["img_j1"]}
              alt="player"
            />
          </div>
          <span className={classes["span"]}>{name_j2}</span>
        </div>
      </div>
    </div>
  );
}
