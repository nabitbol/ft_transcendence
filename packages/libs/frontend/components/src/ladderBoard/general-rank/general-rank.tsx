import classes from "./general-rank.module.css";
import starsClasses from "../../stars.module.css"
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { UserDto } from "@ft-transcendence/libs-shared-types";

function GeneralRank(props: { user: UserDto; }) {

  return (
    <div className={classes['div']}>
      <div className={`${starsClasses["space"]} ${starsClasses["stars1"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars2"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars3"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars4"]}`}></div>
      <h2 className={classes['h2_rank']}>
        <strong>{props.user.ladder_level}</strong>
      </h2>

      <img
        src={getPathToImage(props.user.image)}
        alt={"user avatar"}
        height="50"
        width="50"
        className={classes['img']}
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

export { GeneralRank };
