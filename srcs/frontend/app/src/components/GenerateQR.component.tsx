import { useState } from 'react';
import authReqService from '../services/authReq.service'
import { useEffect } from 'react';
import React from 'react';

const GenerateQr = () => {
	const [IsQrLoad, setIsQrLoad] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	
	async function render() {
		const type : string = "image/png";
		const qrData = await authReqService.requestQr();
		const file = new File([qrData],  type );
		setImageUrl(URL.createObjectURL(file));
	}

	useEffect(() => {
        render();
		setIsQrLoad(true);
    }, []);

	return(
		<div >
			{IsQrLoad && <img alt="Qr-code" src={imageUrl} />}
		</div>
	);
}

export default GenerateQr