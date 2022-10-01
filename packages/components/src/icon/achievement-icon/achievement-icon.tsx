import { Link } from "react-router-dom";

export function AchievementIcon() {
  return (
    <div>
      <Link to={"/achievement"}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="75"
          width="75"
          alt="Achievement_picture"
        />
      </Link>
    </div>
  );
}
