import { useSearchParams } from "react-router-dom";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TwoFa } from "../two-fa/two-fa";
import classes from "./auth-api.module.css";

const AuthApi = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [TwoFaForm, setTwoFaForm] = useState(false);
  const [isError, setIsError] = useState(false);

  const activateTwoFaForm = () => {
    setTwoFaForm(true);
  };

  const ButtonPressed = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    try{
      const code = searchParams.get("code");
      await AuthReq.sendApiCode(code).then(() => {
		const user_data = localStorage.getItem("userdata");
        const user = JSON.parse(user_data);
        if (user && user.doubleAuth)
          activateTwoFaForm();
        else {
          navigate("/home");
          const user = AuthReq.getCurrentUser();
          if (user.first_log === false) {
            window.location.reload();
          }
        }
    });
    }
    catch (err)
    {
		setIsError(true);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div>
	{TwoFaForm && !isError &&
	<div>
	<span> Please enter your 2fa code </span>
	<TwoFa />
	</div>
	}
    {!TwoFaForm && !isError && <span>Wait a moment please...</span>}
	{!TwoFaForm && isError && <span>Auth flow was broken because 42 api
		require new code. Please try again !</span>}
	<button className={classes["btn"]} onClick={ButtonPressed}>
        Go back
      </button>
    </div>
  );
};

export {AuthApi};
