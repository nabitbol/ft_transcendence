import classes from "./home-icon.module.css";
import { Link } from "react-router-dom";

export default function HomeIcon() {
  return (
    <div>
      <Link to={"/home"} className={classes.home_icone}>
        <img
          src={require("../../img/background.png")}
          height="75"
          width="75"
          alt="HomeIcon_picture"
        />
      </Link>
    </div>
  );
}
