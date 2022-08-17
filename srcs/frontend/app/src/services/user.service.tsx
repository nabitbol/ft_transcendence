import axios from 'axios';
import authHeader from './authHeader.service';

const URL = 'http://localhost:3333/user/';

class UserService {
	getAll() {
		return axios.get(URL);
	}
 	createUser(user_info: any)
	{
		axios.post(URL + 'create', user_info)
		.then(response => {
		  console.log(response.data);
		});
	}	
	findByUsername(user_pseudo: any)
	{
		const headers = authHeader();
		return axios.post(URL + 'name_find', user_pseudo, {headers })
		.then(response => {
		  console.log(response.data);
		});
	}
	/*findById(@Body('user_id') user_id: number)
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