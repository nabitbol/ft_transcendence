import classes from "./all-icon.module.css";
import {
  ProfilIcon,
  LadderIcon,
  HomeIcon,
  FriendIcon,
  FriendRequestIcon,
  AchievementIcon,
} from "@ft-transcendence/components";

function AllIcon() {
  return (
    <div>
      <HomeIcone />
      <div className={classes.all_icone}>
        <ProfileIcone />
        <LadderIcone />
        <FriendIcone />
        <FriendRequestIcone />
        <AchievementIcone />
      </div>
    </div>
  );
}

export default AllIcone;
