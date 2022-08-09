export default function authHeader() {
	const user = JSON.parse(localStorage.getItem('userdata'));
	if (user && user.user_JWT) {
	  return { Authorization: 'Bearer ' + user.user_JWT };
	} else {
	  return {};
	}
}