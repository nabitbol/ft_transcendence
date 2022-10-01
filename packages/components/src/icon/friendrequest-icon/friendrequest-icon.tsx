import { Link } from "react-router-dom";

export function FriendRequestIcon() {
  return (
    <div>
      <Link to={"/friend_request"}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="75"
          width="75"
          alt="FriendRequest_picture"
        />
      </Link>
    </div>
  );
}
