export default function authHeader() {
  const tmp = localStorage.getItem("userdata");
  let user;
  if (tmp)
    user = JSON.parse(tmp);
  if (user && user.jwtToken) {
    return { Authorization: "Bearer " + user.jwtToken };
  } else {
    return { Authorization: "" };
  }
}
