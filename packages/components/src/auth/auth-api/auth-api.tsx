import { useSearchParams } from "react-router-dom";
import { Auth as AuthService } from "@ft-transcendence/frontend-services";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthApi = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogin = () => {
    const code = searchParams.get("code");
    AuthService.sendApiCode(code).then(() => {
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

export default AuthApi;
