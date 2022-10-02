import { Link } from "react-router-dom";

export function ProfileIcon() {
  return (
    <div>
      <Link to={"/profile"}>
        <img
          src={require("../../../../../assets/img/friend.png")}
          height="75"
          width="75"
          alt="ProfileIcon_picture"
        />
      </Link>
    </div>
  );
}
