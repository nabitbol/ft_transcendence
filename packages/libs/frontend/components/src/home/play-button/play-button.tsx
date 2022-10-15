import classes from "./play-button.module.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {SocketContext} from '@ft-transcendence/libs-frontend-services';
import { Socket } from 'socket.io';

export function PlayButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const socket: Socket = useContext(SocketContext);

  useEffect(() => {
    console.log("UseEffect PlayButton");
    socket.on('server.gamestart', () => {
      navigate("/game");
      //window.location.reload();
    });


  }, [navigate, socket]);

  const matchMaking = () => {
    if (loading) {
      setLoading(false);
      socket.emit('client.leaveroom');
    }
    else {
      setLoading(true);
      socket.emit('client.entermatchmaking');
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
