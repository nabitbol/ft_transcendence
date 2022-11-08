import { YourProfile } from "@ft-transcendence/libs-frontend-components";
import { AuthReq } from "../../services/src/auth-req/auth-req";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";


function YourProfilePage() {
  const navigate = useNavigate();
  const [userName, setuserName] = useState<string>();

  const getAnswer = useCallback(() => {
    try {
      const user = AuthReq.getCurrentUser();
      if (user === undefined || user.name === undefined) {
        navigate("/error");
      }
      setuserName(user.name);
    } catch (err) {
      navigate("/error");
    }
  }, [navigate]);

  useEffect(() => {
    getAnswer();
  }, [getAnswer]);

  return !userName ? null : <YourProfile name={userName} />;
}

export { YourProfilePage };
