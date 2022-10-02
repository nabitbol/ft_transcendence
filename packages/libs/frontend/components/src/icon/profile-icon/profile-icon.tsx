import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function ProfileIcon() {
  return (
    <div>
      <Link to={"/profile"}>
        <img
          src={getPathToImage("friend")}
          height="75"
          width="75"
          alt="ProfileIcon_picture"
        />
      </Link>
    </div>
  );
}
