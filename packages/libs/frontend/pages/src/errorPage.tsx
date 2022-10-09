import classes from "./errorPage.module.css";
import { useNavigate } from "react-router-dom";

const ErrorPage = (props: any) => {
  const navigate = useNavigate();
  let message: string;
  if (props.message) message = props.message;
  else message = "You are not authorized to access this page";

  const ButtonPressed = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <span className={classes["error"]}>{message}</span>
      <br />
      <button className={classes["btn"]} onClick={ButtonPressed}>
        Go back
      </button>
    </div>
  );
};

export { ErrorPage };
