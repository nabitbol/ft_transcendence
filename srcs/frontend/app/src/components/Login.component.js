import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../auth/auth.service";
import CheckButton from "react-validation/build/button";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default class Login extends Component {
	
	initialState = {
		user_pseudo: "",
		user_password: "",
	};

	state = this.initialState;

	form;
	onChangeUserPseudo = event => {
		this.setState({
			user_pseudo: event.target.value
		});
	}
	
	onChangeUserPassword = event => {
		this.setState({
			user_password: event.target.value
		});
	}

	handleLogin = event => {
		event.preventDefault();
		this.form.validateAll();
		if (this.checkBtn.context._errors.length === 0) {
		  AuthService.login(this.state.user_pseudo, this.state.user_password).then(
			(response) => {
				console.log(response);
				console.log(response.data);
				this.props.history.push("/home");
          		window.location.reload();
			})
			.catch(error => {
				  console.log(error)
			  })
		}
	  }
	
	    render() {
    return (
		
          	<Form onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
			>
			
            <div className="form-group">
              <label htmlFor="user_pseudo">Username</label>
              <Input
                type="text"
                className="form-control"
                name="user_pseudo"
                value={this.state.user_pseudo}
                onChange={this.onChangeUserPseudo}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="user_password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="user_password"
                value={this.state.user_password}
                onChange={this.onChangeUserPassword}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block">
                <span>Login</span>
              </button>
            </div>

			<CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
    );
	}
}