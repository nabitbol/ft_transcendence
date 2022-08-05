export default function authHeader() {
	const user = JSON.parse(localStorage.getItem('userdata'));
	if (user && user.accessToken) {
	  return { Authorization: 'Bearer ' + user.accessToken };
	} else {
	  return {};
	}
}