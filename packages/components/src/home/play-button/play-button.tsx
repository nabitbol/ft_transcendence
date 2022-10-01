import classes from "./play-button.module.css";
import { useState } from "react";

export function PlayButton(props) {
  const [loading, setLoading] = useState(false);

  function clickme() {
    if (loading) setLoading(false);
    else setLoading(true);
  }

  return (
    <div>
      {loading ? (
        <button className={classes.button_play} onClick={clickme}>
          <div className={classes.ldsdualring}></div>
        </button>
      ) : (
        <button className={classes.button_play} onClick={clickme}>
          Play
        </button>
      )}
    </div>
  );
}
