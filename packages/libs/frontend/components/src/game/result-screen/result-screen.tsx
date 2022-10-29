import { MatchDto } from "@ft-transcendence/libs-shared-types";
import classes from "./result-screen.module.css";
import { useNavigate } from "react-router-dom";

const ResultScreen = (props) => {
  const navigate = useNavigate();
  const result: MatchDto = props.result.result;
  console.log(result);

  const ButtonPressed = () => {
    navigate("/home");
    window.location.reload();
  };

  return (
    <div>
      <span className={classes["span"]}>
        {result.playersName[0]} vs {result.playersName[1]}!
    </span >
      <span className={classes["span"]}>
        {result.winner} is the winner !
      </span >
      <span className={classes["span"]}>
        {result.looser} is the loser !
      </span >
      <button className={classes["btn"]} onClick={ButtonPressed}>
        Go back
      </button>
    </div>
  );
};

export { ResultScreen };
