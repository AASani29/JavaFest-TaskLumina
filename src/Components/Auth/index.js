// src/isLoggedIn.js

export function isLoggedIn() {
  let data = localStorage.getItem("role");
  if (data === null) return false;
  else return true;
}

// doLogin - set JWT to localStorage
export function doLogin(data, next) {
  localStorage.setItem("data", JSON.stringify(data));
  next();
}

// doLogout - remove JWT from localStorage
export function doLogout(next) {
  localStorage.removeItem("data");
  next();
}

// getCurrentUser - get current user from localStorage
export function getCurrentUser() {
  if (isLoggedIn()) {
    return localStorage.getItem("role");
  } else return undefined;
}

// getToken - get token from localStorage
export function getToken() {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("data")).token;
  } else return undefined;
}
