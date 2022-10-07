import classes from "../../ladderBoard/general-rank/general-rank.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

function FriendRank(props: {user_id: string; rank: number; key: string}) {
  const name = "erzow";
  const lvl = props.user_id;
  const winrate = "20";
  const elo = "1500";

  return (
    <div className={classes['div']}>
      <h2 className={classes['h2_rank']}>
        <strong>{props.rank}</strong>
      </h2>

      <img
        src={getPathToImage("friend")}
        height="50"
        width="50"
        className={classes['img']}
        alt="friend_avatar"
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

export { FriendRank };
