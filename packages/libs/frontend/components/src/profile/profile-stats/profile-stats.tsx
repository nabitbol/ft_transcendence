import classes from "./profile-stats.module.css";
import { UserDto } from "@ft-transcendence/libs-shared-types";

export function ProfileStats(props: {userInfo: UserDto, user_achievement: string, userWinrate: number}) {
  const userInfo: UserDto = props.userInfo;
  const user_achievement: string = props.user_achievement;
  const userWinrate: number = props.userWinrate;

  return (
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
        <strong className={classes['strong_cascade']}>Achievement:</strong> {user_achievement}
      </span>
    </div>
  );
}
