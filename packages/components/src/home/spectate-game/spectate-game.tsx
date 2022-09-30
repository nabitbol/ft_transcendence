import classes from "./spectate-game.module.css";
import { Backdrop, LiveGame } from "@ft-transcendence/components";
import { useState } from "react";

export default function SpectateGame() {
  const [list, setList] = useState(false);
  const ID = ["1", "2"];

  function clickme_spectate_button() {
    setList(true);
  }

  function clickme_close() {
    setList(false);
  }

  return (
    <div>
      {list && (
        <div>
          <Backdrop closeBackdrop={clickme_close} />
          <div className={classes.div}>
            <h2 className={classes.h2_title}>Live Game</h2>
            <button className={classes.close} onClick={clickme_close}></button>
            {ID.map((ID) => (
              <LiveGame game_id={ID} key={ID} />
            ))}
          </div>
        </div>
      )}
      <button
        className={classes.button_spectate}
        onClick={clickme_spectate_button}
      >
        Spectate Game
      </button>
    </div>
  );
}
