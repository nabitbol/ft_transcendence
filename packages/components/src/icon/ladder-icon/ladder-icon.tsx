import {Link}

from "react-router-dom";

export function LadderIcon() {

	return (
		<div>
			<Link to={"/ladder"}></Link>
			<img src={require('../../../../../assets/img/friend.png')}
				height='75' width='75' alt='LadderIcone_picture' />
		</div>
	);
}
