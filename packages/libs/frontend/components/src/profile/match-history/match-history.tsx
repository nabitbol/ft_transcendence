import classes from "./match-history.module.css";
import { MatchDto } from "@ft-transcendence/libs-shared-types";
import { PastGame } from "@ft-transcendence/libs-frontend-components";
import { useCallback, useEffect } from "react";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function MatchHistory(props: {name: string}) {
  const [matchInfo, setMatchInfo] = useState<MatchDto[]>(undefined);
  const navigate = useNavigate();

  const getAnswer = useCallback( async () => {
    try {
      console.log(props.name);
      const response: MatchDto[] = await User.requestUserMatchInfo(props.name);
      setMatchInfo(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate, props.name]);

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
            <PastGame name={props.name} game_info={ID} key={ID.id} />
          ))}
        </div>
      )}
    </div>
  );
}
