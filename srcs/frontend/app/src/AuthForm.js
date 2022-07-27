import React, {Component} from 'react'
import './index.css';

class AuthForm extends Component
{
	initialState = {
		user_mail: '',
		user_pseudo: '',
		user_password: '',
	}

	state = this.initialState

	render() {
		const { user_mail, user_pseudo, user_password} = this.state;

		return (
		<div>
		  <form>
			<label htmlFor="user_pseudo">Username</label>
			<input
			  type="text"
			  name="user_pseudo"
			  id="user_pseudo"
			  value={user_pseudo}
			  onChange={this.handleChange} />
			<p/>
			<label htmlFor="user_password">Password</label>
			<input
			  type="text"
			  name="user_password"
			  id="user_password"
			  value={user_password}
			  onChange={this.handleChange} />
			<p/>
			<label htmlFor="user_mail">Email</label>
			<input
			  type="text"
			  name="user_mail"
			  id="user_mail"
			  value={user_mail}
			  onChange={this.handleChange} />
			<p/>
			<input className='button-input'type="button"value="Register" onClick={() => { this.submitForm(); this.props.closeBackdrop();}} />
		  </form>
		</div>
		);
	}

	submitForm = () => {
		this.props.register(this.state);
		this.setState(this.initialState)
	}

	handleChange = (event) => {
		const {name, value} = event.target

		this.setState({
			[name]: value,
		})
	}
}

export default AuthForm