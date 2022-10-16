import classes from "./play-button.module.css";
import { useState } from "react";
import { PlayModule, Backdrop } from "@ft-transcendence/libs-frontend-components";

export function PlayButton() {
  const [isOn, setIsOn] = useState(false);

  const clickMe = () => {
    setIsOn(true);
  }

  function clickme_close() {
    setIsOn(false);
  }

  return (
    <div>
      {isOn && (
        <div>
          <Backdrop closeBackdrop={clickme_close} />
          <PlayModule />
        </div>
      )}
      <button className={classes['button_play']} onClick={clickMe}>
        Play
      </button>
    </div>
  );
}
