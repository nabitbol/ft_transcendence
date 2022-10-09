import classes from "./generate-qr.module.css";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GenerateQr(props: any) {
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const getQr = async () => {
    const type = "image/png";
    try {
      const qrData: any= await AuthReq.requestQr();
      if (qrData) {
        const file = new File([qrData], type);
        setImageUrl(URL.createObjectURL(file));
      }
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  }

  useEffect(() => {
    getQr();
  }, []);

  return !imageUrl ? null :(
    <div>
        <img className={classes['qr_img']} alt="Qr-code" src={imageUrl} />
    </div>
  );
};

export { GenerateQr };
