import classes from "./play-module.module.css";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from '@ft-transcendence/libs-frontend-services';
import { Socket } from 'socket.io';
import { Backdrop } from "@ft-transcendence/libs-frontend-components";

const PlayModule = (props: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const socket: Socket = useContext(SocketContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const listenerGameStart = () => {
    navigate("/game");
  }

  function closeBackdrop() {
    setLoading(false);
    socket.emit('client.leaveroom');
    props.closeBackdrop();
  }

  useEffect(() => {
    socket.on('server.gamestart', listenerGameStart);

    return () => {
      socket.off('server.gamestart', listenerGameStart);
    }
  }, [navigate, socket]);

  const sendFormData = (data: any) => {
    if (loading) {
      setLoading(false);
      socket.emit('client.leaveroom');
    }
    else {
      setLoading(true);
      socket.emit('client.entermatchmaking', data.game_mode);
    }
  }

  return (
    <div>
      <Backdrop closeBackdrop={closeBackdrop} />
      <div className={classes["play_module_content"]}>
        <form
          className={classes["play_module_form"]}
          onSubmit={handleSubmit(sendFormData)}
        >
          <h5 className={classes["play_module_label"]}>
            Matchmaking
          </h5>
          <div className={classes["play_module_input_div"]}>
            <label htmlFor="One ball">One ball</label>
            <input {...register("game_mode", { required: true })} type="radio" value="simple" className={classes["play_module_input"]} />
            <label htmlFor="Two ball">Two ball</label>
            <input {...register("game_mode", { required: true })} type="radio" value="double" className={classes["play_module_input"]} />
          </div>

          {errors.game_mode && (
            <div className="alert alert-danger" role="alert">
              You need to select a game mode
            </div>
          )}

          {loading ? (
            <button type="submit" className={classes['ldsdualring']} />
          ) : (
            <input type="submit" className={classes["play_module_btn"]} />
          )}

        </form>
      </div>
    </div>
  );
};

export { PlayModule };
