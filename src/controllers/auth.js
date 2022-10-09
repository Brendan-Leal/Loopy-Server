const successfulRedirectURL = "http://localhost:3000/login-success";

export const redirectOnSuccess = (req, res) => {
  console.log("redirect on success");
  res.redirect(successfulRedirectURL);
};
