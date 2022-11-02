import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function LogoutIcon() {
  const logout = () => {
    localStorage.removeItem("userdata");
  }

  return (
    <div>
      <Link to={"/"}>
        <img
          onClick={logout}
          src={getPathToImage("logout")}
          height="75"
          width="75"
          alt="LogoutIcon_picture"
        />
      </Link>
    </div>
  );
}
