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
      if (response.losses === 0 && response.wins === 0)
        setUserWinrate(0);
      else
        setUserWinrate((response.wins / (response.losses + response.wins))* 100);
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
    <div className={classes["profile_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["profile_left_box"]}>
          <div className={classes["profile_card"]}>
            <img
              className={classes["profile_avatar"]}
              src={getPathToImage("friend")}
              alt="avatar"
            />
            <span className={classes["user_name"]}>
              <strong>{userInfo.name}</strong>
            </span>
            <br />
            <span className={classes["profile_span"]}>
              <strong>Rank:</strong> {userInfo.ladder_level}
            </span>
          </div>
          <QrModule />
        </div>
        <div className={classes["profile_cascade"]}>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Name:</strong> {userInfo.name}
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Email:</strong> {userInfo.email}
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Played games:</strong> {userInfo.losses + userInfo.wins}
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Winrate:</strong> {userWinrate}%
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Game won:</strong> {userInfo.wins}
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Game lost:</strong> {userInfo.losses}
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Achievement:</strong> 1/10 "not dynamic yet"
          </span>
          <span className={classes["profile_span_cascade"]}>
            <strong className={classes['strong_cascade']}>Friends:</strong> 10 "not dynamic yet"
          </span>
        </div>
      </div>
    </div>
  );
}

export { Profile };
