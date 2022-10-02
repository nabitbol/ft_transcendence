import classes from "./achievement.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export default function Achievement({ id }) {
  const description = "do something specific";
  const bool = id % 2;

  return (
    <div className={classes.div}>
      {bool ? (
        <div>
          <img
            src={getPathToImage("achievement")}
            height="60"
            width="60"
            className={classes.img}
            alt="achievement_avatar"
          />
          <p className={classes["p_description"]}>
            <strong>{description}</strong>
          </p>
          <span className={classes["checkmark"]} />
        </div>
      ) : (
        <div className={classes["color"]}>
          <img
            src={getPathToImage("achievement")}
            height="60"
            width="60"
            className={classes.img}
            alt="achievement_avatar"
          />
          <p className={classes["p_description"]}>
            <strong>{description}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
