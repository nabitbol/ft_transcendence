import validator from "validator";

export const vrequired = (value: string) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required !
      </div>
    );
  }
  else
    return '';
};

export const validEmail = (value: string) => {
  if (!validator.isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
  else
    return '';
};

export const vusername_length = (value: string) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
  else
    return '';
};

export const vpassword_length = (value: string) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
  else
    return '';
};

export const vregex = (value: string) => {
  const re = new RegExp("^[a-zA-Z0-9_-]+$");
  if (!re.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This field must only contain alphanumeric characters.
      </div>
    );
  }
  else
    return '';
};

export const vnumber = (value: string) => {
  const re = new RegExp("[0-9]");
  if (!re.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This field must container at least 1 number.
      </div>
    );
  }
  else
    return '';
};

export const vmaj = (value: string) => {
  const re = new RegExp("[A-Z]");
  if (!re.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This field must container at least 1 maj character.
      </div>
    );
  }
  else
    return '';
};

export const vonly_number = (value: string) => {
  const re = new RegExp("[A-Za-z]");
  if (re.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This field must container only number.
      </div>
    );
  }
  else
    return '';
};

export const vonly_letter = (value: string) => {
  const re = new RegExp("^[a-zA-Z_-]+$");
  if (!re.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This field must only contain alphanumeric characters.
      </div>
    );
  }
  else
    return '';
};
