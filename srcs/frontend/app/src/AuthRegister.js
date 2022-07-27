import React, {Component} from 'react'
import AuthForm from './AuthForm'
import Backdrop from './Backdrop'

class AuthRegister extends Component
{
	state = {
		formIsOpen: false,
	}

	desactivateForm = () => {
		this.setState({
			formIsOpen: false
		})
	}

	activateForm = () => {
		this.setState({
			formIsOpen: true
		})
	}

	render() {
		return (
			<div>
				<button className='button-register' onClick={this.activateForm}>Create new account</button>
				{this.state.formIsOpen && <AuthForm register={this.props.register} closeBackdrop={this.desactivateForm}/>}
				{this.state.formIsOpen && <Backdrop closeBackdrop={this.desactivateForm}/>}
			</div>
		)}
}

export default AuthRegister