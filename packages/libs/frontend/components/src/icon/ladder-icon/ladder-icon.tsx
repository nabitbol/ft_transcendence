import { Link } from "react-router-dom";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function LadderIcon() {
  return (
    <div>
      <Link to={"/ladder"}></Link>
      <img
        src={getPathToImage("ladder")}
        height="75"
        width="75"
        alt="LadderIcone_picture"
      />
    </div>
  );
}
