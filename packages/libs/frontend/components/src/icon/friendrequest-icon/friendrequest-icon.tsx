import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function FriendRequestIcon() {
  return (
    <div>
      <Link to={"/friend_request"}>
        <img
          src={getPathToImage("friend_request")}
          height="75"
          width="75"
          alt="FriendRequest_picture"
        />
      </Link>
    </div>
  );
}
