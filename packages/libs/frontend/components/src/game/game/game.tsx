import classes from "./game.module.css";
import { useRef, useEffect, useCallback, useContext, useState } from "react";
import useWindowSize from "./useWindowSize";
import { GameInfo, boxDimensions } from "@ft-transcendence/libs/shared/game";
import { Socket } from "socket.io";
import { SocketGameContext } from "@ft-transcendence/libs-frontend-services";
import { ResultScreen } from "@ft-transcendence/libs-frontend-components";
import { GameData, MatchDto } from "@ft-transcendence/libs-shared-types";

function Game() {
  //Setup variable
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isResultOn, setIsResultOn] = useState<MatchDto>(undefined);
  //const [width, height] = useWindowSize();
  const gameDataRef = useRef<GameData>();
  const boxRef = useRef<boxDimensions>();
  const socket: Socket = useContext(SocketGameContext);
  const inputRef = useRef<{ up: number; down: number }>({ up: 0, down: 0 });

  //Setup socket io event
  const sendInput = useCallback(async (input: { up: number; down: number }) => {
    socket.emit("client.gameinput", input);
  }, [socket]);

  //Setup key event
  const keyDown = useCallback(async (event) => {
    if (event.repeat) return;
    if (event.key === "ArrowUp") inputRef.current.up = 1;
    if (event.key === "ArrowDown") inputRef.current.down = 1;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
      sendInput(inputRef.current);
  },
    [sendInput]
  );

  const keyUp = useCallback(async (event) => {
    if (event.repeat) return;
    if (event.key === "ArrowUp") inputRef.current.up = 0;
    if (event.key === "ArrowDown") inputRef.current.down = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
      sendInput(inputRef.current);
  },
    [sendInput]
  );

  const listenerGameInfo = (response: { info: GameInfo }) => {
    gameDataRef.current = response.info;
  };

  const listenerGameEnd = (result: MatchDto) => {
    setIsResultOn(result);
  };

  useEffect(() => {

    socket.on("server.gameinfo", listenerGameInfo);
    socket.on("server.gameend", listenerGameEnd);
    let canvas: HTMLCanvasElement | null;
    let context: CanvasRenderingContext2D | null;
    let animationFrameId: number;

    const drawHeader = (function () {
      let executed = false;
      return function (gameInfo: GameData) {
        if (!executed) {
          executed = true;
          context.textAlign = "center";
          context.fillText("VS", canvas.width / 2 - 20, 70);
          context.textAlign = "left";
          context.fillText(gameInfo.players_name.left, 0, 70);
          context.textAlign = "right";
          context.fillText(gameInfo.players_name.right, canvas.width, 70);
        }
      };
    })();

    async function draw(box: boxDimensions, gameInfo: GameData) {
      if (context != null && gameInfo) {
        context.clearRect(
          box.box_x + box.box_border_width / 2,
          box.box_y + box.box_border_width / 2,
          box.box_width - box.box_border_width,
          box.box_height - box.box_border_width
        );
        context.fillRect(
          gameInfo.paddle_a.x_pos,
          gameInfo.paddle_a.y_pos,
          gameInfo.paddle_a.width,
          gameInfo.paddle_a.height
        );
        context.fillRect(
          gameInfo.paddle_b.x_pos,
          gameInfo.paddle_b.y_pos,
          gameInfo.paddle_b.width,
          gameInfo.paddle_b.height
        );
        context.fillText(
          gameInfo.player_a_score.toString(),
          box.box_x + box.box_width / 2 - 100,
          box.box_y + 100
        );
        context.fillText(
          gameInfo.player_b_score.toString(),
          box.box_x + box.box_width / 2 + 100,
          box.box_y + 100
        );
        drawHeader(gameInfo);
        for (const ball of gameInfo.ball) {
          context.beginPath();
          context.arc(
            ball.x_pos,
            ball.y_pos,
            ball.circle_radius,
            0,
            2 * Math.PI
          );
          context.fill();
        }
      }
    }

    function initContext() {
      //Setup Event listener
      window.addEventListener("keydown", keyDown);
      window.addEventListener("keyup", keyUp);

      //Create canvas and context
      canvas = canvasRef.current;
      if (canvas == null) return;
      canvas.width = 1920; //width; //Translate ratio to remove blur
      canvas.height = 1016; //height;
      context = canvas.getContext("2d");
      if (context == null) return;
      //Predraw box
      context.font = "48px serif";
      context.fillStyle = "#FFFFFF";
      boxRef.current = new boxDimensions(
        0.8 * canvas.width,
        0.8 * canvas.height,
        0.1 * canvas.width,
        0.1 * canvas.height,
        20
      );
      context.fillRect(
        boxRef.current.box_x,
        boxRef.current.box_y,
        boxRef.current.box_width,
        boxRef.current.box_height
      );
      context.fillStyle = "rgb(0, 0, 0)";
      context.fillText(
        "No connection...",
        canvas.width / 2 - 150,
        canvas.height / 2
      );
      context.fillStyle = "#FFFFFF";
    }

    //Tick function to draw game
    const render = () => {
      if (gameDataRef.current && !isResultOn) {
        if (gameDataRef.current.has_ended) return;
        draw(boxRef.current, gameDataRef.current);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    const endCanvas = () => {
      socket.off("server.gameinfo", listenerGameInfo);
      socket.off("server.gameend", listenerGameEnd);
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };

    initContext();
    render();
    if (gameDataRef.current && gameDataRef.current.has_ended) endCanvas();
    return () => {
      endCanvas();
    };
  }, [keyDown, keyUp, socket, isResultOn]);

  return (
    <div className={classes["background"]}>
      {!isResultOn && <canvas className={classes["game"]} ref={canvasRef} />}
      {isResultOn && <ResultScreen result={isResultOn} />}
    </div>
  );
}

export { Game };
