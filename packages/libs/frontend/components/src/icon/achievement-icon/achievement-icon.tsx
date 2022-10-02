import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function AchievementIcon() {
  return (
    <div>
      <Link to={"/achievement"}>
        <img
          src={getPathToImage("friend")}
          height="75"
          width="75"
          alt="Achievement_picture"
        />
      </Link>
    </div>
  );
}
