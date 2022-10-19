import classes from "./past-game.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { MatchDto } from "@ft-transcendence/libs-shared-types";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";

export function PastGame(props: { game_info: MatchDto }) {
  const name = props.game_info.winner;
  const score = props.game_info.winnerScore;
  const user_info: any = AuthReq.getCurrentUser();
  const result = (props.game_info.winner === user_info.name) ? "Win" : "Lose"
  const name_j2 = props.game_info.looser
  const score_j2 = props.game_info.looserScore;
  return (
    <div className={classes["div"]}>
      <h2 className={classes["h2_vs"]}>-</h2>
      <div className={classes["div_j1"]}>
        <img
          src={getPathToImage("friend")}
          height="50"
          width="50"
          className={classes["img_j1"]}
          alt="player"
        />
        <p className={classes["p_usr_j1"]}>
          <strong>{name}</strong>
        </p>
        <h2 className={classes["h2_score_j1"]}>
          <strong>{score}</strong>
        </h2>
        <p className={classes["p_result_j1"]}>
          <strong>{result}</strong>
        </p>
      </div>
      <div className={classes["div_j2"]}>
        <img
          src={getPathToImage("friend")}
          height="50"
          width="50"
          className={classes["img_j2"]}
          alt="player"
        />
        <p className={classes["p_usr_j2"]}>
          <strong>{name_j2}</strong>
        </p>
        <h2 className={classes["h2_score_j2"]}>
          <strong>{score_j2}</strong>
        </h2>
      </div>
    </div>
  );
}
