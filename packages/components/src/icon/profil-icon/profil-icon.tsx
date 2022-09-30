import { Link } from "react-router-dom";

export default function ProfilIcon() {
  return (
    <div>
      <Link to={"/profile"}>
        <img
          src={require("../../img/avatar.png")}
          height="75"
          width="75"
          alt="ProfileIcon_picture"
        />
      </Link>
    </div>
  );
}
