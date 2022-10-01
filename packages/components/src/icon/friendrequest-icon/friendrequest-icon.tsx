import { Link } from "react-router-dom";

export function FriendRequestIcon() {
  return (
    <div>
      <Link to={"/friend_request"}>
        <img
          src={require("../../../../../assets/img/friend.png")}
          height="75"
          width="75"
          alt="FriendRequest_picture"
        />
      </Link>
    </div>
  );
}
