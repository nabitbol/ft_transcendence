import classes from "./past-game.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { MatchDto, UserDto } from "@ft-transcendence/libs-shared-types";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";
import { useCallback, useEffect, useState } from "react";
import { User } from '@ft-transcendence/libs-frontend-services'
import { useNavigate } from "react-router-dom";

export function PastGame(props: { name: string, game_info: MatchDto }) {
  const logged_username = props.name;
  const name = props.game_info.winner;
  const score = props.game_info.winnerScore;
  const name_j2 = props.game_info.looser
  const score_j2 = props.game_info.looserScore;
  const [winnerInfo, setWinnerInfo] = useState<UserDto>();
  const [loserInfo, setLoserInfo] = useState<UserDto>();
  const navigate = useNavigate();
  const [isWinner, setIsWinner] = useState<boolean>(undefined);

  const getData = useCallback(async () => {
    try {

      const WinnerResponse: UserDto = await User.requestUserInfo(name);
      setWinnerInfo(WinnerResponse);

      const LoserResponse: UserDto = await User.requestUserInfo(name_j2);
      setLoserInfo(LoserResponse);

      if (logged_username === name)
        setIsWinner(true);
      else
        setIsWinner(false);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate, logged_username, name, name_j2]);

  useEffect(() => {
    getData();
  }, [getData])

  return (isWinner === undefined || (!loserInfo || !winnerInfo)) ? null : (
    <div className={
      isWinner
        ? classes["main_container_win"]
        : classes["main_container_lose"]
    } >
      <div className={classes["left_side"]}>
        <div className={classes["fpile"]}>
          <div className={classes["div_j1"]}>
              <img
                src={getPathToImage(winnerInfo.image)}
                height="50"
                width="50"
                className={classes["img_j1"]}
                alt="player"
              />
          </div>
          <span className={classes["span"]}>{name}</span>
        </div>
        <span className={classes["span"]}>{score}</span>
      </div>
      {isWinner &&
        <span className={classes["span_score"]}>
          Victory
        </span>
      }
      {!isWinner &&
        <span className={classes["span_score"]}>
          Defeat
        </span>
      }

      <div className={classes["right_side"]}>
        <span className={classes["span"]}>{score_j2}</span>
        <div className={classes["fpile"]}>
          <div className={classes["div_j1"]}>
              <img
                src={getPathToImage(loserInfo.image)}
                height="50"
                width="50"
                className={classes["img_j1"]}
                alt="player"
              />
          </div>
          <span className={classes["span"]}>{name_j2}</span>
        </div>
      </div>
    </div>
  );
}
