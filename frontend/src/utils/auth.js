class Auth {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl
    this._headers = headers
  }

_checkResponseData(res) {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}

registration(email, password) {
  return fetch(`${this._baseUrl}/signup`, {
    method: "POST",
    headers: this._headers,
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  }).then(this._checkResponseData);
}

login(email, password) {
  return fetch(`${this._baseUrl}/signin`, {
    method: "POST",
    headers: this._headers,
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  .then(this._checkResponseData)
  .then((res) => {
    if (res.token) {
      return res
    }
  })
}

logout() {
  return fetch(`${this._baseUrl}/sign-out`, {
    method: 'POST',
    headers: this._headers,
    credentials: 'include',
  }).then(this._checkResponseData)
}

getToken(token) {
  return fetch(`${this._baseUrl}/users/me`, {
    method: "GET",
    headers: {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  }).then(this._checkResponseData);
}
}
//const BASE_AUTH_URL = "https://api.project-mesto.nomoredomains.rocks";

const auth = new Auth({
  baseUrl: 'https://api.project-mesto.nomoredomains.rocks',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export default auth