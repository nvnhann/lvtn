import Cookies from "js-cookie";

export function isLogin() {
  if (!!Cookies.get("token")) return true;
  return false;
}
