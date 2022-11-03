import { Profile } from "@ft-transcendence/libs-frontend-components";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { name } = useParams();
  return <Profile name={name} />;
}

export { ProfilePage };
