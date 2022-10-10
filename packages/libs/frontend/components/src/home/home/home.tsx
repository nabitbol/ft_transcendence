import classes from "./home.module.css";
import {
  PlayButton,
  PrivateGame,
  SpectateGame,
  MatchHistory,
  AllIcon,
} from "@ft-transcendence/libs-frontend-components";

function Home() {
  return (
    <div className={classes["home_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["home_flex"]}>
          <MatchHistory />
          <div className={classes["home_button_flex"]}>
            <PlayButton />
            <PrivateGame />
            <SpectateGame />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Home };
