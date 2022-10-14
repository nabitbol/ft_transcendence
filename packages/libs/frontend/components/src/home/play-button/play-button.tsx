import classes from "./play-button.module.css";
import { useState, useRef } from "react";
import { io } from "socket.io-client";
export function PlayButton() {
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(io("ws://localhost:3030"));

  const matchMaking = () => {
    if (loading)
    {
      setLoading(false);
      socketRef.current.emit('client.leaveroom');
    }
    else
    {
      setLoading(true);
      socketRef.current.emit('client.entermatchmaking');
    }
  }

  return (
    <div>
      {loading ? (
        <button className={classes['button_play']} onClick={matchMaking}>
          <div className={classes['ldsdualring']}></div>
        </button>
      ) : (
        <button className={classes['button_play']} onClick={matchMaking}>
          Play
        </button>
      )}
    </div>
  );
}
