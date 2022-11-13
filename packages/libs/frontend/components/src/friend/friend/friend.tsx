import classes from "./friend.module.css";
import starsClasses from "../../stars.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { User } from "@ft-transcendence/libs-frontend-services";

export function Friend(props: { user: UserDto }) {
  const name = props.user.name;
  const lvl = props.user.ladder_level;

  function clickme_delete() {
    User.removeFriend(name);
    window.location.reload();
  }

  return (
    <div className={classes['div']}>
      <div className={`${starsClasses["space"]} ${starsClasses["stars1"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars2"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars3"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars4"]}`}></div>
      <img
        src={getPathToImage(props.user.image)}
        height="60"
        width="60"
        className={classes['img']}
        alt="avatar"
      />
      <p className={classes['p_usr']}>
        <strong>{name}</strong>
      </p>
      <p className={classes['p_lvl']}>
        <strong>Ladder rank: {lvl}</strong>
      </p>
      <button className={classes['close']} onClick={clickme_delete}></button>
    </div>
  );
}
