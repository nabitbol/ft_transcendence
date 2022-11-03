import { useNavigate } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function ProfileIcon() {
  const navigate = useNavigate();

  const navigateToProfile = (e) => {
    navigate("/your_profile");
    e.preventDefault();
  };

  return (
    <div>
      <img
        src={getPathToImage("utilisateur")}
        height="75"
        width="75"
        alt="ProfileIcon_picture"
        onClick={(e) => navigateToProfile(e)}
      />
    </div>
  );
}
