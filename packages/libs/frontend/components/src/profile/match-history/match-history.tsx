import classes from "./match-history.module.css";
import { MatchDto } from "@ft-transcendence/libs-shared-types";
import { PastGame } from "@ft-transcendence/libs-frontend-components";
import { useCallback, useEffect } from "react";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function MatchHistory() {
  const [matchInfo, setMatchInfo] = useState<MatchDto[]>(undefined);
  const navigate = useNavigate();

  const getAnswer = useCallback( async () => {
    try {
      const response: MatchDto[] = await User.requestUserMatchInfo();
      setMatchInfo(response);
      console.log(matchInfo);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate]);

  useEffect(() => {
    getAnswer();
  }, [getAnswer]);

  return !matchInfo ? null : (
    <div className={classes["match_history_container"]}>
      <span className={classes["span"]}>Match History</span>
      {matchInfo.length === 0 && (
       <span className={classes["nogame"]}>There is no game</span>
      )}
      {matchInfo && (
        <div className={classes["flex_container"]}>
          {matchInfo.map((ID) => (
            <PastGame game_info={ID} key={ID.id} />
          ))}
        </div>
      )}
    </div>
  );
}
