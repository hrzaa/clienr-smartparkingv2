import Cookies from "js-cookie";

const isAuthenticated = () => {
  const token = Cookies.get("token");
  return !!token;
};

export default isAuthenticated;
