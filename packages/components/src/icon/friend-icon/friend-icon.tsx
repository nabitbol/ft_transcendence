import { Link } from "react-router-dom";

export default function FriendIcon() {
  return (
    <div>
      <Link to={"/friend"}>
        <img
          src={require("../../img/friend.png")}
          height="75"
          width="75"
          alt="FriendIcon_picture"
        />
      </Link>
    </div>
  );
}
