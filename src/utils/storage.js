export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}
export function setLocalStorage(key) {
  localStorage.setItem(key)
}
export function getSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key))
}
export function setSessionStorage(key) {
  sessionStorage.setItem(key)
}
