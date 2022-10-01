import classes from "./home-icon.module.css";
import { Link } from "react-router-dom";

export function HomeIcon() {
  return (
    <div>
      <Link to={"/home"} className={classes.home_icone}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="75"
          width="75"
          alt="HomeIcon_picture"
        />
      </Link>
    </div>
  );
}
