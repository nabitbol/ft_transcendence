import { Link } from "react-router-dom";

export function FriendIcon() {
  return (
    <div>
      <Link to={"/friend"}>
        <img
          src={require("../../../../../assets/img/friend.png")}
          height="75"
          width="75"
          alt="FriendIcon_picture"
        />
      </Link>
    </div>
  );
}
