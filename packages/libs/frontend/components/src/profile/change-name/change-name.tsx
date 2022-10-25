import { useForm } from "react-hook-form";
import { useState } from "react";
import { User } from '@ft-transcendence/libs-frontend-services'
import classes from "./change-name.module.css"
import { vusername_length, vregex } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";

function ChangeName() {
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const onSubmit = async (data: any) => {
        console.log(data.user_name);
        setMessage("");
        const user: UserDto = await User.verifUserName(data.user_name);
        console.log(user);
        if (user) {
            setMessage("This name is already use by a user");
            return ;
        }
        await User.changeName(data.user_name);
        window.location.reload();
    };
  
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                className={
                    errors["user_name"]
                      ? classes["module_input_red"]
                      : classes["module_input"]
                  }
                    {...register("user_name", {
                        required: true,
                        validate: {
                            length: vusername_length,
                            regex: vregex,
                          },
                    })} type="text" />
                {errors["user_name"] && errors["user_name"].type === "length" && (
                <div className="alert alert-danger" role="alert">
                    The username must be between 4 and 25 characters.
                </div>
                )}
                {errors["user_name"] && errors["user_name"].type === "regex" && (
                <div className="alert alert-danger" role="alert">
                    This field must only contain alphanumeric characters.
                </div>
                )}
               <input type="submit" className={classes["module_btn"]} />
            </form>
            {message && (
                <div className="alert alert-danger" role="alert">
                    {message}
                </div>)}
        </div>
    );
}

export { ChangeName };