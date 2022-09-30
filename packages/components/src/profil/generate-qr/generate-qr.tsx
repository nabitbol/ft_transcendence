import classes from "./generate-qr.module.css";
import authReqService from "@ft-transcendence/frontend-services";
import { useState } from "react";
import { useEffect } from "react";

const GenerateQr = (props) => {
  const [IsQrLoad, setIsQrLoad] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function render() {
    const type: string = "image/png";
    try {
      const qrData = await authReqService.requestQr();
      if (qrData.data) {
        const file = new File([qrData.data], type);
        setImageUrl(URL.createObjectURL(file));
      }
    } catch (err) {
      props.errorCase();
    }
  }

  useEffect(() => {
    render();
    setIsQrLoad(true);
  }, []);

  return (
    <div>
      {IsQrLoad && (
        <img className={classes.qr_img} alt="Qr-code" src={imageUrl} />
      )}
    </div>
  );
};

export default GenerateQr;
