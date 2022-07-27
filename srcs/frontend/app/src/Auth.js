import React from 'react';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';
import { Component } from "react";
import './index.css';
import axios from 'axios'

class Auth extends Component {

	signIn = (user_info) => {
		axios.post('http://localhost:3333/auth/login', user_info)
		.then(response => {
		  console.log(response);
		  console.log(response.data);
		})
		.catch(error => {
			console.log(error)
		})
	}

	register = (user_info) => {
		axios.post('http://localhost:3333/auth/register', user_info)
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
				<AuthLogin signIn={this.signIn}/>
				<AuthRegister register={this.register}/>
			</div>
		)
	}
}

export default Auth;