import { Profile } from "@ft-transcendence/libs-frontend-components";
import { AuthReq } from "../../services/src/auth-req/auth-req";

function YourProfilePage() {
  const user = AuthReq.getCurrentUser();
  return <Profile name={user.name} />;
}

export { YourProfilePage };
