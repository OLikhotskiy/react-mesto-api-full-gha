class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }
  _request(url, options) {
    return fetch(url, options).then(this._getResponseData);
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards/`, {
      credentials: 'include',
      headers: this._headers,
    });
  }

  addCard(cardData) {
    return this._request(`${this._baseUrl}/cards/`, {
      method: "POST",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    });
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me/`, {
      credentials: 'include',
      headers: this._headers,
    });
  }

  setUserInfo(newData) {
    return this._request(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: newData.name,
        about: newData.about,
      }),
    });
  }

  setUserAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._headers,
        method: "PUT",
        credentials: 'include',
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._headers,
        method: "DELETE",
        credentials: 'include',
      });
    }
  }
}

const api = new Api({
  baseUrl: "api.project-mesto.nomoredomains.rocks",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: 'include',
});

export default api;
//
