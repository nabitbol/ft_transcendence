import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function FriendIcon() {
  return (
    <div>
      <Link to={"/friend"}>
        <img
          src={getPathToImage("friend")}
          height="80"
          width="80"
          alt="FriendIcon_picture"
        />
      </Link>
    </div>
  );
}
