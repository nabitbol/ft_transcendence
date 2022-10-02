import classes from "./all-icon.module.css";

import {
  ProfileIcon,
  LadderIcon,
  HomeIcon,
  FriendIcon,
  FriendRequestIcon,
  AchievementIcon,
} from "@ft-transcendence/libs-frontend-components";

function AllIcon() {
  return (
    <div>
      <HomeIcon />
      <div className={classes.all_icone}>
        <ProfileIcon />
        <LadderIcon />
        <FriendIcon />
        <FriendRequestIcon />
        <AchievementIcon />
      </div>
    </div>
  );
}

export {AllIcon};
