// Simple parental gate, not real authentication: this is a client-only app
// with no backend, so the credentials live in the shipped JS bundle and are
// visible to anyone who opens dev tools. It only exists to stop a young
// child from wandering into the app without a grown-up - not to protect
// anything sensitive.
const AUTH_KEY = "adrit-learns-auth";
const USERNAME = "ADRIT";
const PASSWORD = "2905";

export function checkCredentials(username: string, password: string): boolean {
  return username.trim().toUpperCase() === USERNAME && password === PASSWORD;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function setLoggedIn() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, "true");
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}
