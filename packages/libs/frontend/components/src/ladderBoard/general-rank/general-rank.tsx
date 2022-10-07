import classes from "./general-rank.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

function GeneralRank(props: { user_id: string; rank: number }) {
  const name = "eswox";
  const lvl = props.user_id;
  const winrate = "10";
  const elo = "500";

  return (
    <div className={classes['div']}>
      <h2 className={classes['h2_rank']}>
        <strong>{props.rank}</strong>
      </h2>

      <img
        src={getPathToImage("friend")}
        alt={"user avatar"}
        height="50"
        width="50"
        className={classes['img']}
      />
      <p className={classes['p_usr']}>
        <strong>{name}</strong>
      </p>
      <p className={classes['p_lvl']}>
        <strong>Lvl: {lvl}</strong>
      </p>
      <p className={classes['p_winrate']}>
        <strong>Win %: {winrate}</strong>
      </p>
      <p className={classes['p_elo']}>
        <strong> Elo: {elo}</strong>
      </p>
    </div>
  );
}

export { GeneralRank };
