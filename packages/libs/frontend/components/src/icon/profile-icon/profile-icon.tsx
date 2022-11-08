import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { Link } from "react-router-dom";

export function ProfileIcon() {

  return (
    <div>
      <Link to={"/your_profile"}>

        <img
          src={getPathToImage("utilisateur")}
          height="75"
          width="75"
          alt="ProfileIcon_picture"
        />
      </Link>
    </div>
  );
}
