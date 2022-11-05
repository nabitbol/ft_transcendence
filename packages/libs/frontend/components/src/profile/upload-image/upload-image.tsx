import { useForm } from "react-hook-form";
import { useState } from "react";
import { User } from '@ft-transcendence/libs-frontend-services'
import classes from "./upload-image.module.css"

function UploadImage() {
    const [message, setMessage] = useState("");
    const [successful, setsuccessful] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        setMessage("");
        setsuccessful(false);
        if (data.image[0].type !== "image/png") {
            setMessage("Need a png image");
            return;
        }
        if (data.image[0].size > 100000) {
            setMessage("Please upload a image smaller than 100 Ko");
            return;
        }
        setsuccessful(true);
        await User.getBase64(data.image[0])
            .then(async result => {
                data.image["base64"] = result;
                await User.sendImage(data.image);
            });
    };

    return (
        <div>
            <span className={classes["span"]}>
                Edit profile avatar
            </span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    className={
                        errors["image"]
                            ? classes["module_input_red"]
                            : classes["module_input"]
                    }
                    {...register("image", {
                        required: true,
                    })} type="file"
                    accept=".png" />
                <input type="submit" className={classes["module_btn"]} />
            </form>
            {message && (
                <div className="alert alert-danger" role="alert">
                    {message}
                </div>)}
            {successful &&
                <div className="alert alert-success" role="alert">
                    You sucessfully changed your name.
                </div>
            }
        </div>
    );
}

export { UploadImage };