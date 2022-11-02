import classes from "./all-icon.module.css";

import {
  ProfileIcon,
  LadderIcon,
  HomeIcon,
  FriendIcon,
  FriendRequestIcon,
  AchievementIcon,
  ChatIcon,
  LogoutIcon
} from "@ft-transcendence/libs-frontend-components";

function AllIcon() {
  return (
    <div>
      <HomeIcon />
      <div className={classes['all_icone']}>
        <ChatIcon />
        <LadderIcon />
        <AchievementIcon />
        <FriendRequestIcon />
        <FriendIcon />
        <ProfileIcon />
        <LogoutIcon />
      </div>
    </div>
  );
}

export {AllIcon};
