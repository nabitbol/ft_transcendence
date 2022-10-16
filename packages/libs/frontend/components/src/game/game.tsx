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
  const gameInfoRef = useRef<GameInfo>();
  const boxRef = useRef<boxDimensions>();
  const socket: Socket = useContext(SocketContext);
  const inputRef = useRef<{ up: number, down: number }>({ up: 0, down: 0 });
  //Setup socket io event
  const sendInput = useCallback((input: { up: number, down: number }) => {
    socket.emit('client.gameinput', input);
  }, [socket]);

  //Setup key event
  const keyDown = useCallback(function (event) {
    if (event.repeat)
      return
    if (event.key === "ArrowUp")
      inputRef.current.up = 1;
    if (event.key === "ArrowDown")
      inputRef.current.down = 1;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
      sendInput(inputRef.current);
  }, [sendInput]);

  const keyUp = useCallback(function (event) {
    if (event.repeat)
      return
    if (event.key === "ArrowUp")
      inputRef.current.up = 0;
    if (event.key === "ArrowDown")
      inputRef.current.down = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
      sendInput(inputRef.current);
  }, [sendInput]);

  useEffect(() => {
    console.log("In useEffect game");

    socket.on('server.gameinfo', (response: { info: GameInfo }) => {
      gameInfoRef.current = response.info;
    });

    let canvas: HTMLCanvasElement | null;
    let context: CanvasRenderingContext2D | null;
    let animationFrameId: number;

    function draw(box: boxDimensions, gameInfo: GameInfo) {
      console.log(gameInfo);
      if (context != null && gameInfo) {
        context.clearRect(box.box_x + box.box_border_width / 2, box.box_y + box.box_border_width / 2, box.box_width - box.box_border_width, box.box_height - box.box_border_width);
        context.fillRect(gameInfo.paddle_a.x_pos, gameInfo.paddle_a.y_pos, gameInfo.paddle_a.width, gameInfo.paddle_a.height);
        context.fillRect(gameInfo.paddle_b.x_pos, gameInfo.paddle_b.y_pos, gameInfo.paddle_b.width, gameInfo.paddle_b.height);
        context.fillText(gameInfo.player_a_score.toString(), box.box_x + box.box_width / 2 - 100, box.box_y + 100);
        context.fillText(gameInfo.player_b_score.toString(), box.box_x + box.box_width / 2 + 100, box.box_y + 100);
        for (const ball of gameInfo.ball) {
          context.beginPath()
          context.arc(ball.x_pos, ball.y_pos, ball.circle_radius, 0, 2 * Math.PI)
          context.fill()
        }
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
      if (gameInfoRef.current) {
        if (gameInfoRef.current.has_ended)
          return;
        draw(boxRef.current, gameInfoRef.current);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    const endCanvas = () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };

    initContext();
    render();
    if (gameInfoRef.current && gameInfoRef.current.has_ended)
      endCanvas();;
    return () => {
      endCanvas();
    };
  }, [height, width, keyDown, keyUp, socket]);

  return (
    <div className={classes["background"]}>
      <canvas className={classes["game"]} ref={canvasRef} />
    </div>
  );
}

export { Game };
