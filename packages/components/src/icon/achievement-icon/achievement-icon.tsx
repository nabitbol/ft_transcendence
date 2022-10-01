import { Link } from "react-router-dom";

export function AchievementIcon() {
  return (
    <div>
      <Link to={"/achievement"}>
        <img
          src={require("../../../../../assets/img/friend.png")}
          height="75"
          width="75"
          alt="Achievement_picture"
        />
      </Link>
    </div>
  );
}
