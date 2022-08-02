import axios from 'axios';
import authHeader from './auth-header';

const URL = 'http://localhost:3333/user/';

class UserService {
	getAll() {
		return axios.get(URL);
	}
 	/*createUser(user_info)
	{
		axios.post(URL + 'create', user_info)
		.then(response => {
		  console.log(response);
		  console.log(response.data);
		})
		.catch(error => {
			console.log(error)
		})
	}	
	findByUsername(user_pseudo)
	{
		return axios.get(URL + 'user', { headers: authHeader() });
	}	
	findById(@Body('user_id') user_id: number)
	{
		return this.userService.findById(user_id);
	}	
	RemoveUser(@Body('user_id') user_id: number)
	{
		return this.userService.removeUser(user_id);
	}	
	getProfile(@Request() req) {
	  return req.user;
	}*/
}
export default new UserService();