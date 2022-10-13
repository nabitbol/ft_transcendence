import classes from "./achievement-list.module.css";
import Achievement from "../achievement/achievement";
import { AllIcon } from "@ft-transcendence/libs-frontend-components";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@ft-transcendence/libs-frontend-services"
import { UserDto, AchievementDto } from "@ft-transcendence/libs-shared-types";

export function AchievementList() {
  const [user_achievement_ID, setUserAchievement] = useState<UserDto>(undefined);
  const [achievement_ID, setAchievement] = useState<AchievementDto[]>(undefined);
  const navigate = useNavigate();

  const getAnswer = async () => {
    try {
      const response_user: UserDto = await User.requestUserInfo();
      setUserAchievement(response_user);
      const response_achievement: AchievementDto[] = await User.requestAchievement();
      setAchievement(response_achievement);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return !achievement_ID ? null :(
    <div className={classes["achievement_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["achievement_content"]}>
          <h2 className={classes["h2_title"]}>Achievement</h2>
          <div className={classes["achievement_list"]}>
            {user_achievement_ID.achievement.map((achievement_ID) => (
              <Achievement id={achievement_ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
