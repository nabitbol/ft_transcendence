import authReqService from '../services/authReq.service'
import {QRCodeSVG} from 'qrcode.react';

const GenerateQR = () => {
	function render() {
		const url = authReqService.requestQR();
		return <QRCodeSVG value={url} />;
	}
	return <div>{render()}</div>;
}

export default GenerateQR