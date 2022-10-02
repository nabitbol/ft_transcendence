import { useSearchParams } from "react-router-dom";
import { AuthReq } from "@ft-transcendence/frontend-services";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthApi = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogin = () => {
    const code = searchParams.get("code");
    AuthReq.sendApiCode(code).then(() => {
      navigate("/home");
      window.location.reload();
    });
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
