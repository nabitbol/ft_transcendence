import classes from "./your-profile.module.css";
import starsClasses from "../../stars.module.css"
import {
  QrModule,
  AllIcon,
  ProfileStats,
  MatchHistory,
  EditUser,
  Backdrop
} from "@ft-transcendence/libs-frontend-components";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { UserDto, AchievementDto } from "@ft-transcendence/libs-shared-types";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";

function YourProfile(props) {
  const [userInfo, setUserInfo] = useState<UserDto>(undefined);
  const [userEdit, setUserEdit] = useState<boolean>(false);
  const [userWinrate, setUserWinrate] = useState<number>();
  const [user_achievement, setUserAchievement] = useState<string>(undefined);
  const navigate = useNavigate();

  const onClickEdit = () => {
    setUserEdit(true);
  }

  const onCloseEdit = () => {
    setUserEdit(false);
    window.location.reload();
  }

  const getAnswer = useCallback(async () => {
    try {
      await User.updateUserAchievement();
      const response_user: AchievementDto[] =
        await User.requestUserAchievement(props.name);
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
  }, [navigate, props.name]);

  useEffect(() => {
    getAnswer();
  }, [getAnswer]);

  return !userInfo ? null : (
    <div className={classes["profile_container"]}>
      <div className={`${starsClasses["space"]} ${starsClasses["stars1"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars2"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars3"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars4"]}`}></div>
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
              <img
                src={getPathToImage("edit")}
                height="30"
                width="30"
                alt="edit_picture"
                onClick={onClickEdit}
              />
              <br />
              <span className={classes["profile_span"]}>
                <strong>Rank:</strong> {userInfo.ladder_level}
              </span>
              {userEdit && <EditUser />}
              {userEdit && <Backdrop closeBackdrop={onCloseEdit} />}
            </div>
            <QrModule />
          </div>
          <div className={classes["profile_right_box"]}>
            <MatchHistory name={props.name}/>
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
