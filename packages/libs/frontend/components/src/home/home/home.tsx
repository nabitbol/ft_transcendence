import classes from "./home.module.css";
import {
  PlayButton,
  PrivateGame,
  SpectateGame,
  MatchHistory,
} from "@ft-transcendence/libs-frontend-components";
function Home() {
  return (
    <div className={classes.home_container}>
      <div className={classes.home_flex}>
        <MatchHistory />
        <div className={classes.home_button_flex}>
          <PlayButton />
          <PrivateGame />
          <SpectateGame />
        </div>
      </div>
    </div>
  );
}

export {Home};
