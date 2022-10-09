import classes from "./welcome.module.css";
import { Auth } from "@ft-transcendence/libs-frontend-components";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

function Welcome() {
  return (
    <div className={classes['welcome_body']}>
      <div className={`${classes["space"]} ${classes["stars1"]}`}></div>
      <div className={`${classes["space"]} ${classes["stars2"]}`}></div>
      <div className={`${classes["space"]} ${classes["stars3"]}`}></div>
      <div className={`${classes["space"]} ${classes["stars4"]}`}></div>
      <Auth />
      <img
        id={classes["welcomeimage"]}
        src={getPathToImage("firechicken")}
        alt="welcome"
      ></img>
    </div>
  );
}

export { Welcome };
