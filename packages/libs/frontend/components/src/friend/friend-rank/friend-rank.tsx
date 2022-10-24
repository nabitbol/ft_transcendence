import classes from "../../ladderBoard/general-rank/general-rank.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { UserDto } from "@ft-transcendence/libs-shared-types";

function FriendRank(props: {user: UserDto; }) {

  return (
    <div className={classes['div']}>
      <h2 className={classes['h2_rank']}>
        <strong>{props.user.ladder_level}</strong>
      </h2>

      <img
        src={getPathToImage("friend")}
        height="50"
        width="50"
        className={classes['img']}
        alt="friend_avatar"
      />
      <p className={classes['p_usr']}>
        <strong>{props.user.name}</strong>
      </p>
      <p className={classes['p_winrate']}>
        <strong>Win : {props.user.wins}</strong>
      </p>
    </div>
  );
}

export { FriendRank };
