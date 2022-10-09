import classes from "./profile.module.css";
import { QrModule, AllIcon } from "@ft-transcendence/libs-frontend-components";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { useEffect } from "react";
import { useState } from "react";
import { UserDto } from '@ft-transcendence/libs-shared-types'
import { User } from '@ft-transcendence/libs-frontend-services'
import { useNavigate } from "react-router-dom";

function Profile() {

  const [userInfo, setUserInfo] = useState<UserDto>();
  const [userWinrate, setUserWinrate] = useState<number>();
  const navigate = useNavigate();

  const getAnswer = async () => {
    try {
      const response: UserDto = await User.requestUserInfo();
      if (response.losses === 0 || response.wins === 0)
        setUserWinrate(0);
      else
        setUserWinrate((response.wins / (response.losses + response.wins)));
      setUserInfo(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, [])

  return !userInfo ? null : (
    <div>
        <AllIcon />
        <div className={classes["profile_container"]}>
          <div className={classes["profile_left_box"]}>
            <div className={classes["profile_card"]}>
              <img
                className={classes["profile_avatar"]}
                src={getPathToImage("friend")}
                alt="zaeeza"
              />
              <span className={classes["profile_span"]}>
                <strong>{userInfo.name}</strong>
              </span>
              <br />
              <span className={classes["profile_span"]}>
                <strong>Lvl:</strong> {userInfo.level}
              </span>
            </div>
            <QrModule />
          </div>
          <div className={classes["profile_cascade"]}>
            <span className={classes["profile_span_cascade"]}>
              <strong>Played games:</strong> {userInfo.losses + userInfo.wins}
            </span>
            <span className={classes["profile_span_cascade"]}>
              <strong>Email:</strong> {userInfo.email}
            </span>
            <span className={classes["profile_span_cascade"]}>
              <strong>Winrate:</strong> {userWinrate}%
            </span>
            <span className={classes["profile_span_cascade"]}>
              <strong>Elo:</strong> {userInfo.level}
            </span>
            <span className={classes["profile_span_cascade"]}>
              <strong>Victory:</strong> {userInfo.wins}
            </span>
            <span className={classes["profile_span_cascade"]}>
              <strong>Defeat:</strong> {userInfo.losses}
            </span>
          </div>
        </div>
      </div>
  );
}

export { Profile };
