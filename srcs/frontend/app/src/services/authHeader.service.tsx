export default function authHeader() {
	const tmp = localStorage.getItem('userdata');
	let user;
	if (tmp)
		user = JSON.parse(tmp);
	if (user && user.user_JWT) {
	  return { Authorization: 'Bearer ' + user.user_JWT };
	} else {
	  return {Authorization: ''};
	}
}