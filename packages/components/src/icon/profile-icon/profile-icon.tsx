import { Link } from "react-router-dom";

export function ProfileIcon() {
  return (
    <div>
      <Link to={"/profile"}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="75"
          width="75"
          alt="ProfileIcon_picture"
        />
      </Link>
    </div>
  );
}
