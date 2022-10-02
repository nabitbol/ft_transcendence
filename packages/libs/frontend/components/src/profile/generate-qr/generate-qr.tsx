import classes from "./generate-qr.module.css";
import {AuthReq} from "@ft-transcendence/libs-frontend-services";
import { useState } from "react";
import { useEffect } from "react";

const GenerateQr = (props: any) => {
  const [IsQrLoad, setIsQrLoad] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function render() {
    const type = "image/png";
    try {
      const qrData = await AuthReq.requestQr();
      if (qrData.data) {
        const file = new File([qrData.data], type);
        setImageUrl(URL.createObjectURL(file));
      }
    } catch (err) {
      console.log('error');
    }
  }

  useEffect(() => {
    render();
    setIsQrLoad(true);
  }, []);

  return (
    <div>
      {IsQrLoad && (
        <img className={classes['qr_img']} alt="Qr-code" src={imageUrl} />
      )}
    </div>
  );
};

export {GenerateQr};
