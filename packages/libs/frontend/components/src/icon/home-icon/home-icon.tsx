import classes from "./home-icon.module.css";
import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function HomeIcon() {
  return (
    <div>
      <Link to={"/home"} className={classes.home_icone}>
        <img
          src={getPathToImage("friend")}
          height="75"
          width="75"
          alt="HomeIcon_picture"
        />
      </Link>
    </div>
  );
}
