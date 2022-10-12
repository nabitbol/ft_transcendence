import classes from "./game.module.css";
import { useRef, useEffect, useState, useCallback } from "react";
import useWindowSize from "./useWindowSize";
import { GameInfo, boxDimensions } from "@ft-transcendence/libs/shared/game";
import { io } from "socket.io-client";

function Game() {

  console.log("Load game component");
  //Setup variable
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [width, height] = useWindowSize();
  const socketRef = useRef(io("ws://localhost:3000"));
  let gameInfo: GameInfo;

  //Setup socket io event
  const sendInput = useCallback((input: { up: number, down: number }) => {
    socketRef.current.emit('game:input', input);
  }, []);

  socketRef.current.on('game:info', (info: GameInfo) => {
    gameInfo = info;
  });

  //Setup key event
  const keyDown = useCallback(function (event: any) {
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

  const keyUp = useCallback(function (event: any) {
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
    console.log("In useEffect");
    let canvas: HTMLCanvasElement | null;
    let context: CanvasRenderingContext2D | null;
    let animationFrameId: number;
    const endCanvas = () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };

    function draw(gameInfo: GameInfo) {
      if (context != null) {
        context.clearRect(gameInfo.boxDimensions.box_x + gameInfo.boxDimensions.box_border_width / 2, gameInfo.boxDimensions.box_y + gameInfo.boxDimensions.box_border_width / 2, gameInfo.boxDimensions.box_width - gameInfo.boxDimensions.box_border_width, gameInfo.boxDimensions.box_height - gameInfo.boxDimensions.box_border_width);
        context.fillRect(gameInfo.paddle_a.x_pos, gameInfo.paddle_a.y_pos, gameInfo.paddle_a.width, gameInfo.paddle_a.height);
        context.fillRect(gameInfo.paddle_b.x_pos, gameInfo.paddle_b.y_pos, gameInfo.paddle_b.width, gameInfo.paddle_b.height);
        context.fillText(gameInfo.player_a_score.toString(), gameInfo.boxDimensions.box_x + gameInfo.boxDimensions.box_width / 2 - 100, gameInfo.boxDimensions.box_y + 100);
        context.fillText(gameInfo.player_b_score.toString(), gameInfo.boxDimensions.box_x + gameInfo.boxDimensions.box_width / 2 + 100, gameInfo.boxDimensions.box_y + 100);
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
      const box = new boxDimensions(
        0.8 * canvas.width,
        0.8 * canvas.height,
        0.1 * canvas.width,
        0.1 * canvas.height,
        20
      )
      //Predraw box
      context.font = "48px serif";
      context.fillStyle = "#FFFFFF";
      context.fillRect(
        box.box_x,
        box.box_y,
        box.box_width,
        box.box_height
      );
    }

    //Tick function to draw game
    const render = () => {
      if (gameInfo)
        draw(gameInfo);
      animationFrameId = window.requestAnimationFrame(render);
    };

    //Start the game
      console.log("In start game");
      initContext();
      socketRef.current.emit('game:launch');
      if (!isGameOver)
        render();

    //Remove event listener when unmounting component
    return () => {
      endCanvas();
    };
  }, [sendInput, isGameOver, height, width, gameInfo, keyDown, keyUp]);

  return (
    <div className={classes["background"]}>
      {!isGameOver && <canvas className={classes["game"]} ref={canvasRef} />}
      {isGameOver && <span>Game over</span>}
    </div>
  );
}

export { Game };
