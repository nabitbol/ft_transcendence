import classes from "./game.module.css";
import { useRef, useEffect, useCallback, useContext } from "react";
import useWindowSize from "./useWindowSize";
import { GameInfo, boxDimensions } from "@ft-transcendence/libs/shared/game";
import { Socket } from 'socket.io';
import { SocketContext } from '@ft-transcendence/libs-frontend-services';

function Game() {
  //Setup variable
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, height] = useWindowSize();
  let gameInfo: GameInfo;
  const boxRef = useRef<boxDimensions>();
  const socket: Socket = useContext(SocketContext);
  console.log("Game socket" + socket.data);
  //Setup socket io event
  const sendInput = useCallback((input: { up: number, down: number }) => {
    socket.emit('game.input', input);
  }, [socket]);

  //Setup key event
  const keyDown = useCallback(function (event) {
    if (event.repeat)
      return
    const input = { up: 0, down: 0 };
    if (event.key === "ArrowUp")
      input.up = 1;
    if (event.key === "ArrowDown")
      input.down = 1;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
      sendInput(input);
  }, [sendInput]);

  const keyUp = useCallback(function (event) {
    if (event.repeat)
      return
    const input = { down: 0, up: 0 };
    if (event.key === "ArrowUp")
      input.up = 0;
    if (event.key === "ArrowDown")
      input.down = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
      sendInput(input);
  }, [sendInput]);

  useEffect(() => {
    console.log("In useEffect game");

    socket.on('server.gameinfo', (info: GameInfo) => {
      console.log('test');
      console.log(info);
      gameInfo.copyInfo(info);
    });
  
    socket.on('server.message', (message: string) => {
      console.log(message);
    });

    let canvas: HTMLCanvasElement | null;
    let context: CanvasRenderingContext2D | null;
    let animationFrameId: number;

    function draw(gameInfo: GameInfo) {
      console.log("DRAW");
      if (context != null) {
        context.clearRect(boxRef.current.box_x + boxRef.current.box_border_width / 2, boxRef.current.box_y + boxRef.current.box_border_width / 2, boxRef.current.box_width - boxRef.current.box_border_width, boxRef.current.box_height - boxRef.current.box_border_width);
        context.fillRect(gameInfo.paddle_a.x_pos, gameInfo.paddle_a.y_pos, gameInfo.paddle_a.width, gameInfo.paddle_a.height);
        context.fillRect(gameInfo.paddle_b.x_pos, gameInfo.paddle_b.y_pos, gameInfo.paddle_b.width, gameInfo.paddle_b.height);
        context.fillText(gameInfo.player_a_score.toString(), boxRef.current.box_x + boxRef.current.box_width / 2 - 100, boxRef.current.box_y + 100);
        context.fillText(gameInfo.player_b_score.toString(), boxRef.current.box_x + boxRef.current.box_width / 2 + 100, boxRef.current.box_y + 100);
        context.beginPath()
        context.arc(gameInfo.ball.x_pos, gameInfo.ball.y_pos, gameInfo.ball.circle_radius, 0, 2 * Math.PI)
        context.fill()
      }
    }

    function initContext() {
      //Setup Event listener
      window.addEventListener("keydown", keyDown);
      window.addEventListener("keyup", keyUp);

      //Create canvas and context
      canvas = canvasRef.current;
      if (canvas == null)
        return;
      canvas.width = 1920;//width;
      canvas.height = 1016;//height;
      context = canvas.getContext("2d");
      if (context == null)
        return;
      //Predraw box
      context.font = "48px serif";
      context.fillStyle = "#FFFFFF";
      boxRef.current = new boxDimensions(
        0.8 * canvas.width,
        0.8 * canvas.height,
        0.1 * canvas.width,
        0.1 * canvas.height,
        20
      )
      context.fillRect(
        boxRef.current.box_x,
        boxRef.current.box_y,
        boxRef.current.box_width,
        boxRef.current.box_height
      );
    }

    //Tick function to draw game
    const render = () => {
      if (gameInfo)
        draw(gameInfo);
      animationFrameId = window.requestAnimationFrame(render);
    };

    const endCanvas = () => {
      /*socket.off('server.gameinfo', '');
      socket.off('server.message', (message: string));*/
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };

    initContext();
    render();

    return () => {
      endCanvas();
    };
  }, [height, width, gameInfo, keyDown, keyUp, socket]);

  return (
    <div className={classes["background"]}>
      <canvas className={classes["game"]} ref={canvasRef} />
    </div>
  );
}

export { Game };
