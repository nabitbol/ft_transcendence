import classes from "./home.module.css";
import {
  PlayButton,
  SpectateGame,
  AllIcon,
} from "@ft-transcendence/libs-frontend-components";
import ChickenSvg from './chicken.jsx';

function Home() {
  return (
    <div className={classes["home_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["home_flex"]}>
          <ChickenSvg />
          <div className={classes["home_button_flex"]}>
            <PlayButton />
            <SpectateGame />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Home };
