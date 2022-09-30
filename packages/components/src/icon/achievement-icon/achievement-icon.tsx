import { Link } from "react-router-dom";

export default function AchievementIcon() {
  return (
    <div>
      <Link to={"/achievement"}>
        <img
          src={require("../../img/firechicken.png")}
          height="75"
          width="75"
          alt="Achievement_picture"
        />
      </Link>
    </div>
  );
}
