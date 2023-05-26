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
      headers: this._headers,
    });
  }

  addCard(cardData) {
    return this._request(`${this._baseUrl}/cards/`, {
      method: "POST",
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
      headers: this._headers,
    });
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me/`, {
      headers: this._headers,
    });
  }

  setUserInfo(newData) {
    return this._request(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
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
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._headers,
        method: "DELETE",
      });
    }
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-59",
  headers: {
    authorization: "2785cf20-4641-41b7-b993-5f3d50ff39ad",
    "Content-Type": "application/json",
  },
});

export default api;
//
