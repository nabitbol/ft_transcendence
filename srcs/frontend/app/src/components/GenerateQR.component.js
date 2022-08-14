import { useState } from 'react';
import authReqService from '../services/authReq.service'
import { useEffect } from 'react';

const GenerateQR = () => {
	const [IsQRLoad, setIsQRLoad] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	
	async function render() {
		const qrData = await authReqService.requestQR();
		const file = new File([qrData], { type: "image/png" } ); 
		setImageUrl(URL.createObjectURL(file)); 
	}

	useEffect(() => {
        render();
		setIsQRLoad(true);
    }, []);

	return(
		<div >
			<span>
			Generating 2FA QRcode...
			</span>
			{IsQRLoad && <img alt="QR-code" src={imageUrl} />}
		</div>
	);
}

export default GenerateQR