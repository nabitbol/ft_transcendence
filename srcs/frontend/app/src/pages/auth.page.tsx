import Login from '../components/Login.component';
import Register from '../components/Register.component';
import { useState } from "react";
import Backdrop from '../components/Backdrop.component';
import Navbar from '../components/Navbar.component'

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
			<a href={'http://localhost:3333/auth/login/42'}>
			<button className='btn btn-primary btn-block'>Connect with 42 intra</button>
			</a>
			<span> You already have an account ? </span>
			<button className='btn btn-primary btn-block' onClick={activateLoginForm}>Login here</button>
			{LoginForm && <Login/>}
			{RegisterForm && <Register/>}
			{(LoginForm || RegisterForm) && <Backdrop closeBackdrop={desactivateForm}/>}
		</div>
	)
}

export default AuthPage