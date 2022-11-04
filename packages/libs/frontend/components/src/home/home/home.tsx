import classes from "./home.module.css";
import {
  PlayButton,
  SpectateGame,
  AllIcon,
  EditUser,
  Backdrop
} from "@ft-transcendence/libs-frontend-components";
import ChickenSvg from './chicken.jsx';
import { useEffect, useState } from "react";
import { AuthReq } from '@ft-transcendence/libs-frontend-services'

function Home() {
  const [userEdit, setUserEdit] = useState<boolean>(false);

  const getAnswer = () => {
    const user = AuthReq.getCurrentUser();
    if (user.first_log === true)
    {
      user.first_log = false;
      console.log(user);
      localStorage.setItem("userdata", JSON.stringify(user));
      setUserEdit(true);
    }
  };

  const onCloseEdit = () => {
    setUserEdit(false);
  }

  useEffect(() => {
    getAnswer();
  }, []);

  return (
    <div className={classes["home_container"]}>
      <div className={classes["blur_component"]}>
        {userEdit && <EditUser />}
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
