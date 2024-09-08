export function isLoggedIn() {
  let data = localStorage.getItem("userData");
  if (data === null) return false;
  else return true;
}

// doLogin - set JWT to localStorage
export function doLogin(data, next) {
  localStorage.setItem("userData", JSON.stringify(data));
  next();
}

// doLogout - remove JWT from localStorage
export function doLogout(next) {
  localStorage.removeItem("userData");
  next();
}

// getCurrentUser - get user data from localStorage
export function getCurrentUser() {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("userData"));
  } else return undefined;
}

// getToken - get token from localStorage
export function getToken() {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("userData")).token;
  } else return undefined;
}
