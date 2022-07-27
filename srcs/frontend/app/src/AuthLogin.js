import React, {Component} from 'react'

class AuthLogin extends Component
{
	initialState = {
		user_pseudo: '',
		user_password: '',
	}

	state = this.initialState

	render() {
		const { user_pseudo, user_password } = this.state;

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
				<input className='button-input'type="button"value="Sign in" onClick={this.submitAuthLogin} />
			</form>
		</div>
		);
	}

	submitAuthLogin = () => {
		this.props.signIn(this.state);
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

export default AuthLogin