import {Link}

from "react-router-dom";

export function LadderIcon() {

	return (
		<div>
			<Link to={"/ladder"}></Link>
			<img src={require('/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png')}
				height='75' width='75' alt='LadderIcone_picture' />
		</div>
	);
}
