import React from "react";

export const vrequired = (value: any) => {
	if (!value) {
		return (
			<div className="alert alert-danger" role="alert">
			This field is required !
			</div>
		);
	}
};

export const validEmail = (value: any) => {
	if (!(value)) {  //check email
		return (
			<div className="alert alert-danger" role="alert">
			This is not a valid email.
			</div>
		);
	}
};

export const vusername_length = (value: any) => {
	if (value.length < 3 || value.length > 20) {
		return (
			<div className="alert alert-danger" role="alert">
			The username must be between 3 and 20 characters.
			</div>
		);
	}
};

export const vpassword_length = (value: any) => {
	if (value.length < 6 || value.length > 40) {
		return (
			<div className="alert alert-danger" role="alert">
			The password must be between 6 and 40 characters.
			</div>
		);
	}
};


export const vregex =(value: any) => {
	var re = new RegExp("^[a-zA-Z0-9_-]+$");
	if (!re.test(value))
	{
		return (
			<div className="alert alert-danger" role="alert">
			This field must only contain alphanumeric characters.
			</div>
		);
	}
}

export const vnumber = (value: any) => {
	var re = new RegExp ("[0-9]");
	if (!re.test(value))
	{
		return (
			<div className="alert alert-danger" role="alert">
			This field must container at least 1 number.
			</div>
		);
	}
}

export const vmaj = (value: any) => {
	var re = new RegExp ("[A-Z]");
	if (!re.test(value))
	{
		return (
			<div className="alert alert-danger" role="alert">
			This field must container at least 1 maj character.
			</div>
		);
	}
};