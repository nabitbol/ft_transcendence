import classes from "./achievement-list.module.css";
import Achievement from "../achievement/achievement";
import { AllIcon } from "@ft-transcendence/libs-frontend-components";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthReq, User } from "@ft-transcendence/libs-frontend-services"
import { AchievementDto } from "@ft-transcendence/libs-shared-types";

export function AchievementList() {
  const [user_achievement_ID, setUserAchievement] = useState<AchievementDto[]>(undefined);
  const [achievement_ID, setAchievement] = useState<AchievementDto[]>(undefined);
  const navigate = useNavigate();

  const getAnswer = useCallback(async () => {
    try {
      await User.updateUserAchievement();
      const user = AuthReq.getCurrentUser();
      const response_user: AchievementDto[] = await User.requestUserAchievement(user.name);
      setUserAchievement(response_user);
      const response_achievement: AchievementDto[] = await User.requestAchievement();
      console.log(response_achievement);
      setAchievement(response_achievement);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate]);

  useEffect(() => {
    getAnswer();
  }, [getAnswer]);

  return !achievement_ID ? null :(
    <div className={classes["achievement_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["achievement_content"]}>
          <h2 className={classes["h2_title"]}>Achievement</h2>
          <div className={classes["achievement_list"]}>
            {achievement_ID.map((ID) => (
              <Achievement key={ID.id} achievement={ID} user_achievement={user_achievement_ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
