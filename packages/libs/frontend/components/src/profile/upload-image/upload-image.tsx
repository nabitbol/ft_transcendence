import { useForm } from "react-hook-form";
import { useState } from "react";
import { User } from '@ft-transcendence/libs-frontend-services'

function UploadImage() {
    const [message, setMessage] = useState("");


    const { register, handleSubmit } = useForm();


    const onSubmit = (data: any) => {
        setMessage("");
        if (data.image[0].type !== "image/png")
            setMessage("Need a png image");
            User.getBase64(data.image[0])
            .then(result => {
              data.image["base64"] = result;
              console.log("File Is", data.image);
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