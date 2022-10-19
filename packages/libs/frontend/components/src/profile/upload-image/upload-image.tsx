import { useForm } from "react-hook-form";
import { useState } from "react";
import { User } from '@ft-transcendence/libs-frontend-services'

function UploadImage() {
    const [message, setMessage] = useState("");


    const { register, handleSubmit } = useForm();


    const onSubmit = async (data: any) => {
        setMessage("");
        if (data.image[0].type !== "image/png")
            setMessage("Need a png image");
            await User.getBase64(data.image[0])
            .then(async result => {
              data.image["base64"] = result;
              await User.sendImage(data.image);
            });
    };
  
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Change profil image"
                    {...register("image", {
                        required: true,
                    })} type="file"
                    accept=".png" />
                <button>Submit</button>
            </form>
            {message && (
                <div className="alert alert-danger" role="alert">
                    {message}
                </div>)}
        </div>
    );
}

export { UploadImage };