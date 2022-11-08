import classes from "./first-log.module.css";
import {
  UploadImage,
  ChangeName
} from "@ft-transcendence/libs-frontend-components";

function FirstLog() {

  return (
    <div className={classes["container"]}>
      <span className={classes["span"]}>
        Welcome to Pong Universe
      </span>
      <UploadImage />
      <ChangeName />
    </div>
  );
}

export { FirstLog };
