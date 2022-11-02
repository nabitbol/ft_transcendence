import { MatchDto, UserDto } from "@ft-transcendence/libs-shared-types";
import classes from "./result-screen.module.css";
import { useNavigate } from "react-router-dom";
import { AuthReq } from "@ft-transcendence/libs-frontend-services"
import { useCallback, useEffect, useState } from "react";
import { User } from '@ft-transcendence/libs-frontend-services'
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

const ResultScreen = (props) => {
  const navigate = useNavigate();
  const result: MatchDto = props.result.result;
  const [isWinner, setIsWinner] = useState<boolean>(undefined);
  const [winnerWinrate, setWinnerWinrate] = useState<number>();
  const [loserWinrate, setLoserWinrate] = useState<number>();
  const [winnerInfo, setWinnerInfo] = useState<UserDto>();
  const [loserInfo, setLoserInfo] = useState<UserDto>();

  const ButtonPressed = () => {
    navigate("/home");
    window.location.reload();
  };

  const getData = useCallback(async () => {
    try {
      const WinnerResponse: UserDto = await User.requestUserInfo(result.winner);
      if (WinnerResponse.losses === 0 && WinnerResponse.wins === 0)
        setWinnerWinrate(0);
      else
        setWinnerWinrate((WinnerResponse.wins / (WinnerResponse.losses + WinnerResponse.wins)) * 100);
      setWinnerInfo(WinnerResponse);

      const LoserReponse: UserDto = await User.requestUserInfo(result.looser);
      if (LoserReponse.losses === 0 && LoserReponse.wins === 0)
        setLoserWinrate(0);
      else
        setLoserWinrate((LoserReponse.wins / (LoserReponse.losses + LoserReponse.wins)) * 100);
      setLoserInfo(LoserReponse);

      const user = AuthReq.getCurrentUser();
      if (user.name === result.winner)
        setIsWinner(true);
      else
        setIsWinner(false);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate, result.looser, result.winner]);

  useEffect(() => {
    getData();
  }, [getData])

  return isWinner === undefined ? null : (
    <div>
      <div className={classes["result"]}>
        <div className={
          isWinner
            ? classes["header_score_win"]
            : classes["header_score_lose"]
        }>
          <span className={classes["span_header"]}>
            {result.winnerScore}
          </span>
          {isWinner &&
            <span className={classes["span_header"]}>
              Victory
            </span>
          }
          {!isWinner &&
            <span className={classes["span_header"]}>
              Defeat
            </span>
          }
          <span className={classes["span_header"]}>
            {result.looserScore}
          </span>
        </div>
        <div className={classes["player_data"]}>
          <div className={classes["box_player_left"]}>
            <div className={classes["pile"]}>
              <span className={classes["user_name"]}>
                {result.winner}
              </span>
              <span className={classes["span_player_data"]}>
                Rank {winnerInfo.ladder_level}
              </span>
              <span className={classes["span_player_data"]}>
                {Math.round(winnerWinrate)}%
              </span>
            </div>
            <img
              className={classes["profile_avatar"]}
              src={getPathToImage(winnerInfo.image)}
              alt="avatar"
            />
          </div>
          <span className={classes["user_name"]}>
            VS
          </span>
          <div className={classes["box_player_right"]}>
            <img
              className={classes["profile_avatar"]}
              src={getPathToImage(loserInfo.image)}
              alt="avatar"
            />
            <div className={classes["pile"]}>
              <span className={classes["user_name"]}>
                {result.looser}
              </span>
              <span className={classes["span_player_data"]}>
                Rank {loserInfo.ladder_level}
              </span>
              <span className={classes["span_player_data"]}>
                {Math.round(loserWinrate)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <button className={classes["btn"]} onClick={ButtonPressed}>
        Go back
      </button>
    </div>
  );
};

export { ResultScreen };
