import classes from "./home.module.css";
import {
  PlayButton,
  SpectateGame,
  AllIcon,
  FirstLog,
  Backdrop
} from "@ft-transcendence/libs-frontend-components";
import ChickenSvg from './chicken.jsx';
import { useCallback, useEffect, useState } from "react";
import { AuthReq } from '@ft-transcendence/libs-frontend-services'
import { useNavigate } from "react-router-dom";

function Home() {
  const [userEdit, setUserEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  const getAnswer = useCallback(() => {
    try {
      const user = AuthReq.getCurrentUser();
      if (user.first_log === true) {
        user.first_log = false;
        localStorage.setItem("userdata", JSON.stringify(user));
        setUserEdit(true);
      }
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }, [navigate]);

  const onCloseEdit = () => {
    setUserEdit(false);
    window.location.reload();
  }

  useEffect(() => {
    getAnswer();
  }, []);

  return (
    <div className={classes["home_container"]}>
      <div className={classes["blur_component"]}>
        {userEdit && <FirstLog />}
        {userEdit && <Backdrop closeBackdrop={onCloseEdit} />}
        <AllIcon />
        <div className={classes["home_flex"]}>
          <div className={classes["home_button_flex"]}>
            <PlayButton />
            <SpectateGame />
          </div>
          <ChickenSvg />
        </div>
      </div>
    </div>
  );
}

export { Home };
