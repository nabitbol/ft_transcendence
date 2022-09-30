import { Link } from "react-router-dom";

export default function FriendRequestIcon() {
  return (
    <div>
      <Link to={"/friend_request"}>
        <img
          src={require("../../img/friend_request.png")}
          height="75"
          width="75"
          alt="FriendRequest_picture"
        />
      </Link>
    </div>
  );
}
