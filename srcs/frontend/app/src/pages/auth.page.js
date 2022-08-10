import Login from '../components/Login.component';
import Register from '../components/Register.component';
import React, { useState } from "react";
import Backdrop from '../components/Backdrop.component';
import Navbar from '../components/Navbar.component'
import AuthService from "../services/authReq.service";

function AuthPage () {

	const [LoginForm, setLoginForm] = useState(false);
	const [RegisterForm, setRegisterForm] = useState(false);

	const desactivateForm = () => {
		setRegisterForm(false);
		setLoginForm(false);
	}

	const activateLoginForm = () => {
		setRegisterForm(false);
		setLoginForm(true);
	}

	const activateRegisterForm = () => {
		setLoginForm(false);
		setRegisterForm(true);
	}

	return(
		<div>
			<Navbar/>
			<button className='btn btn-primary btn-block' onClick={activateRegisterForm}>Create a new account</button>
			<button className='btn btn-primary btn-block' onClick={AuthService.reqBackApi}>Connect with 42 intra</button>
			<span> You already have an account ? </span>
			<button className='btn btn-primary btn-block' onClick={activateLoginForm}>Login here</button>
			{LoginForm && <Login/>}
			{RegisterForm && <Register/>}
			{(LoginForm || RegisterForm) && <Backdrop closeBackdrop={desactivateForm}/>}
		</div>
	)
}

export default AuthPage