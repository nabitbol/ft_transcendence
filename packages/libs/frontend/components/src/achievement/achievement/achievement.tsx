import classes from "./achievement.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { AchievementDto } from "@ft-transcendence/libs-shared-types";

export default function Achievement(props: { achievement: AchievementDto, user_achievement: AchievementDto[] }) {
  let i = 0;
  let bool: boolean = false;
  if (props.user_achievement != undefined)
  {
    while (props.user_achievement[i])
    {
      if (props.user_achievement[i].id == props.achievement.id)
        bool = true;
      i++;
    }
  }

  return (
    <div className={classes['div']}>
      {bool ? (
        <div>
          <img
            src={getPathToImage("achievement")}
            height="60"
            width="60"
            className={classes['img']}
            alt="achievement_avatar"
          />
          <p className={classes["p_description"]}>
            <strong>{props.achievement.content}</strong>
          </p>
          <span className={classes["checkmark"]} />
        </div>
      ) : (
        <div className={classes["color"]}>
          <img
            src={getPathToImage("achievement")}
            height="60"
            width="60"
            className={classes['img']}
            alt="achievement_avatar"
          />
          <p className={classes["p_description"]}>
            <strong>{props.achievement.content}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
