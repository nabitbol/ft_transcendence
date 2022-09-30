import classes from "./private-game.module.css";
import { PrivateGameJoin, Backdrop } from "@ft-transcendence/components";
import { useState } from "react";

export default function PrivateGame(this: any) {
  const [find_create, setFindCreate] = useState(false);
  const [join, setJoin] = useState(false);
  const [lobby, setLobby] = useState(false);
  const name = "ESwox";
  const lvl = "55";
  const winrate = "100";
  const name_j2 = "Erzow";
  const lvl_j2 = "100000";
  const winrate_j2 = "0 lol";

  function clickme_private_button() {
    setFindCreate(true);
  }
  function clickme_backdrop() {
    setFindCreate(false);
    setLobby(false);
    setJoin(false);
  }

  function clickme_close() {
    setLobby(false);
  }

  function clickme_join_button() {
    setFindCreate(false);
    setJoin(true);
  }

  function clickme_create_button() {
    setFindCreate(false);
    setLobby(true);
  }

  return (
    <div>
      {find_create && (
        <div>
          <Backdrop closeBackdrop={clickme_backdrop} />
          <div className={classes.button_container}>
            <button className={classes.button} onClick={clickme_create_button}>
              Create private game
            </button>
            <button className={classes.button} onClick={clickme_join_button}>
              Join private game
            </button>
          </div>
        </div>
      )}
      <button
        className={classes.button_private}
        onClick={clickme_private_button}
      >
        Private Game
      </button>
      {lobby && (
        <div>
          <Backdrop closeBackdrop={clickme_backdrop} />
          <div className={classes.private_game}>
            <h2 className={classes.h2_title}>Private game</h2>
            <h2 className={classes.h2_vs}>VS</h2>
            <div className={classes.div_j1}>
              <img
                src={require("../../img/avatar2.jpg")}
                height="100"
                width="100"
                alt="private_avatar"
              />
              <p className={classes.p_usr_j1}>
                <strong>{name}</strong>
              </p>
              <p>
                <strong>Lvl:</strong> {lvl}
              </p>
              <p>
                <strong>Win %:</strong> {winrate}
              </p>
            </div>
            <div className={classes.div_j2}>
              <img
                src={require("../../img/avatar2.jpg")}
                height="100"
                width="100"
                alt="private_opponent_avatar"
              />
              <p className={classes.p_usr_j2}>
                <strong>{name_j2}</strong>
              </p>
              <p>
                <strong>Lvl:</strong> {lvl_j2}
              </p>
              <p>
                <strong>Win %:</strong> {winrate_j2}
              </p>
            </div>
            <button className={classes.button_start}>Start</button>
            <button className={classes.button_invite}>Invite friend</button>
            <button className={classes.close} onClick={clickme_close}></button>
          </div>
        </div>
      )}
      {join && (
        <div>
          <Backdrop closeBackdrop={clickme_backdrop} />
          <PrivateGameJoin />
        </div>
      )}
    </div>
  );
}
