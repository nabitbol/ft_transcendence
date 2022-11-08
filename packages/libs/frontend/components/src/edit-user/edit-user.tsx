import classes from "./edit-user.module.css";
import {
  UploadImage,
  ChangeName,
} from "@ft-transcendence/libs-frontend-components";

function EditUser() {

  return (
    <div className={classes["container"]}>
      <UploadImage />
      <ChangeName />
    </div>
  );
}

export { EditUser };
