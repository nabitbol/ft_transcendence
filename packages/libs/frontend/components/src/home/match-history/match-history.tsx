import classes from "./match-history.module.css";
import { MatchDto } from "@ft-transcendence/libs-shared-types";
import { PastGame } from "@ft-transcendence/libs-frontend-components";
import { useEffect } from "react";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function MatchHistory() {
  const [matchInfo, setMatchInfo] = useState<MatchDto[]>(undefined);
  const navigate = useNavigate();

  const getAnswer = async () => {
    try {
      const response: MatchDto[] = await User.requestUserMatchInfo();
      setMatchInfo(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return !matchInfo ? null : (
    <div className={classes.div}>
      <span className={classes.matchhistory_span}>Match History</span>
      {matchInfo === undefined && (
        <label className={classes.matchhistory_label}>No game yet</label>
      )}
      {matchInfo && (
        <div>
          {matchInfo.map((ID) => (
            <PastGame game_info={ID} key={ID.id} />
          ))}
        </div>
      )}
    </div>
  );
}
