import classes from "./friend.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function Friend({ user_id }) {
  const name = "erzow";
  const lvl = user_id;

  function clickme_delete() {
    console.log("friend no more");
  }

  return (
    <div className={classes.div}>
      <img
        src={getPathToImage("friend")}
        height="60"
        width="60"
        className={classes.img}
        alt="avatar"
      />
      <p className={classes.p_usr}>
        <strong>{name}</strong>
      </p>
      <p className={classes.p_lvl}>
        <strong>Lvl: {lvl}</strong>
      </p>
      <button className={classes.close} onClick={clickme_delete}></button>
    </div>
  );
}