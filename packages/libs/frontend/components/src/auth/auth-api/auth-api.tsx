import { useSearchParams } from "react-router-dom";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthApi = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try{
      const code = searchParams.get("code");
      await AuthReq.sendApiCode(code).then(() => {
      navigate("/home");
      window.location.reload();
    });
    }
    catch (err)
    {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    handleLogin();
  });

  return (
    <div>
      <span>Wait a moment please...</span>
    </div>
  );
};

export {AuthApi};
