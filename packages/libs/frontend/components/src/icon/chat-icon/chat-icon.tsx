import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function ChatIcon() {
  return (
    <div>
      <Link to={"/chat"}>
        <img
          src={getPathToImage("chat")}
          height="75"
          width="75"
          alt="ChatIcon_picture"
        />
      </Link>
    </div>
  );
}
