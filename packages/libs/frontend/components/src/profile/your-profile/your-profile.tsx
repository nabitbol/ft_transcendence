import classes from "./your-profile.module.css";
import {
  QrModule,
  AllIcon,
  UploadImage,
  ProfileStats,
  MatchHistory,
  ChangeName,
} from "@ft-transcendence/libs-frontend-components";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { UserDto, AchievementDto } from "@ft-transcendence/libs-shared-types";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";

function YourProfile(props) {
  const [userInfo, setUserInfo] = useState<UserDto>();
  const [userWinrate, setUserWinrate] = useState<number>();
  const [user_achievement, setUserAchievement] = useState<string>(undefined);
  const navigate = useNavigate();

  const getAnswer = useCallback(async () => {
    try {
      await User.updateUserAchievement();
      const response_user: AchievementDto[] =
        await User.requestUserAchievement();
      let tmp = "";
      let i = 0;
      if (!response_user[i]) tmp = "none";
      while (response_user[i]) {
        tmp += response_user[i].title;
        if (response_user[i + 1]) tmp += ", ";
        i++;
      }
      setUserAchievement(tmp);
      const response: UserDto = await User.requestUserProfileInfo(props.name);
      if (response.losses === 0 && response.wins === 0) setUserWinrate(0);
      else
        setUserWinrate(
          (response.wins / (response.losses + response.wins)) * 100
        );
      setUserInfo(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate]);

  useEffect(() => {
    getAnswer();
  }, [getAnswer]);

  return !userInfo ? null : (
    <div className={classes["profile_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["profile_content"]}>
          <div className={classes["profile_left_box"]}>
            <div className={classes["profile_card"]}>
              <img
                className={classes["profile_avatar"]}
                src={getPathToImage(userInfo.image)}
                alt="avatar"
              />
              <span className={classes["user_name"]}>
                <strong>{userInfo.name}</strong>
              </span>
              <br />
              <span className={classes["profile_span"]}>
                <strong>Rank:</strong> {userInfo.ladder_level}
              </span>
              <UploadImage />
              <ChangeName />
            </div>
            <QrModule />
          </div>
          <div className={classes["profile_right_box"]}>
            <MatchHistory />
            <ProfileStats
              userInfo={userInfo}
              user_achievement={user_achievement}
              userWinrate={userWinrate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { YourProfile };
