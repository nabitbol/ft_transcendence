import validator from "validator";

export const vrequired = (value: string) => {
  if (!value) {
    return (false);
  }
  else
    return true;
};

export const validEmail = (value: string) => {
  if (!validator.isEmail(value)) {
    return (false);
  }
  else
    return true;
};

export const vusername_length = (value: string) => {
  if (value.length < 4 || value.length > 25) {
    return (false);
  }
  else
    return true;
};

export const vpassword_length = (value: string) => {
  if (value.length < 8 || value.length > 40) {
    return (false);
  }
  else
    return true;
};

export const vregex = (value: string) => {
  const re = new RegExp("^[a-zA-Z0-9!-/:-@[-`{-~]+$");
  if (!re.test(value)) {
    return (false);
  }
  else
    return true;
};

export const vnumber = (value: string) => {
  const re = new RegExp("[0-9]");
  if (!re.test(value)) {
    return (false);
  }
  else
    return true;
};

export const vmaj = (value: string) => {
  const re = new RegExp("[A-Z]");
  if (!re.test(value)) {
    return (false);
  }
  else
    return true;
};

export const vonly_number = (value: string) => {
  const re = new RegExp("[A-Za-z]");
  if (re.test(value)) {
    return (false);
  }
  else
    return true;
};

export const vonly_letter = (value: string) => {
  const re = new RegExp("^[a-zA-Z_-]+$");
  if (!re.test(value)) {
    return (false);
  }
  else
    return true;
};
