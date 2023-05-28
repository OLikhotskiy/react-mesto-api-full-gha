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

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me/`, {
      headers: this._headers,
      credentials: 'include',
    });
  }

  setUserInfo(newData) {
    return this._request(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: newData.name,
        about: newData.about,
      }),
    });
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards/`, {
      headers: this._headers,
      credentials: 'include',
    });
  }

  addCard(cardData) {
    return this._request(`${this._baseUrl}/cards/`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
      credentials: 'include',
    });
  }

  
  setUserAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: "PUT",
        headers: this._headers,
        credentials: 'include',
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: "DELETE",
        headers: this._headers,
        credentials: 'include',
      });
    }
  }
}

const api = new Api({
  baseUrl: "https://api.project-mesto.nomoredomains.rocks",
  headers: {
    'Accept': 'application/json',
    "Content-Type": "application/json",
  },
});

export default api;
//
