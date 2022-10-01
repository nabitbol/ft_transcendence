import classes from "./welcome.module.css";
import { Auth } from "@ft-transcendence/components";

function Welcome() {
  return (
    <div>
      <div className={`${classes["space"]} ${classes["stars1"]}`}></div>
      <div className={`${classes["space"]} ${classes["stars2"]}`}></div>
      <div className={`${classes["space"]} ${classes["stars3"]}`}></div>
      <div className={`${classes["space"]} ${classes["stars4"]}`}></div>
      <Auth />
      <img
        id={classes["welcomeimage"]} 
        src={require("../../../../assets/img/firechicken.png")}
        alt="welcome"
      ></img>
    </div>
  );
}

export { Welcome };
