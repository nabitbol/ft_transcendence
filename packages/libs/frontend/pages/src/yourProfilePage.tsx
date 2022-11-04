import { YourProfile } from "@ft-transcendence/libs-frontend-components";
import { AuthReq } from "../../services/src/auth-req/auth-req";

function YourProfilePage() {
  const user = AuthReq.getCurrentUser();
  return <YourProfile name={user.name} />;
}

export { YourProfilePage };
