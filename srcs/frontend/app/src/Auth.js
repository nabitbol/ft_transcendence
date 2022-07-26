import React from 'react';
import AuthForm from './AuthForm';
import { Component } from "react";
import './index.css';
import axios from 'axios'

class Auth extends Component {

	SignIn = () => {

		const user_info = {
			user_mail: 'test',// this.state.user_mail ,
			user_pseudo: 'test',// this.state.user_pseudo ,
			user_JWT: 'test',// this.state.user_JWT ,
			user_status: 1,// this.state.user_status ,
		};
		
		axios.post('http://localhost:3333', user_info)
		.then(response => {
		  console.log(response);
		  console.log(response.data);
		})
		.catch(error => {
			console.log(error)
		})
	}

	render() { 
		return (
			<div>
				<AuthForm SignIn={this.SignIn}/>
			</div>
		)
	}
}

export default Auth;