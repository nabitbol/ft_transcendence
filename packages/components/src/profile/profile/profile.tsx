import classes from "./profile.module.css";
import {QrModule} from "@ft-transcendence/components";
import { useEffect } from "react";
import { useState } from "react";

function Profile() {
  const [QrOn, setQrOn] = useState(true);

  const handleLogin = () => {
    const user_data = localStorage.getItem("userdata");
    let user: any;
    if (user_data) user = JSON.parse(user_data);
    if (user && !user.user_TwoFa_on) setQrOn(true);
  };

  const name = "ESwox";
  const lvl = "55";

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div>
      <div className={classes['profile_container']}>
          <div className={classes['profile_left_box']}>
            <div className={classes['profile_card']}>
              <img
                className={classes['profile_avatar']}
                src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
                alt="zaeeza"
              />
              <span className={classes['profile_span']}>
                <strong>{name}</strong>
              </span>
              <br />
              <span className={classes['profile_span']}>
                <strong>Lvl:</strong> {lvl}
              </span>
            </div>
            {QrOn && <QrModule/>}
          </div>
          <div className={classes['profile_cascade']}>
            <span className={classes['profile_span_cascade']}>
              <strong>Played games:</strong> 7
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Winrate:</strong> 54%
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Elo:</strong> 54%
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Victory:</strong> 4
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Defeat:</strong>3
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Draw:</strong> 0
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Cocacola:</strong> {"54%"}
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Fanta:</strong> {"54%"}
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Pepsi:</strong> {"54%"}
            </span>
            <span className={classes['profile_span_cascade']}>
              <strong>Orangina:</strong> {"54%"}
            </span>
          </div>
        </div>
    </div>
  );
}

export {Profile};
