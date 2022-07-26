import React, {Component} from 'react'

class AuthForm extends Component
{
	initialState = {
		user_name: '',
		user_password: '',
	}

	state = this.initialState

	render() {
		const { user_name, user_password } = this.state;

		return (
		  <form>
			<label htmlFor="user_name">Username</label>
			<input
			  type="text"
			  name="user_name"
			  id="user_name"
			  value={user_name}
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
			<input className='button-input'type="button"value="Sign in" onClick={this.submitAuthForm} />
		  </form>
		);
	}

	submitAuthForm = () => {
		this.props.SignIn(this.state);
		this.setState({
			user_password: ''
		})
	}

	handleChange = (event) => {
		const {name, value} = event.target

		this.setState({
			[name]: value,
		})
	}
}

export default AuthForm