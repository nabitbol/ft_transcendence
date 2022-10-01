import { Link } from "react-router-dom";

export function FriendIcon() {
  return (
    <div>
      <Link to={"/friend"}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="75"
          width="75"
          alt="FriendIcon_picture"
        />
      </Link>
    </div>
  );
}
