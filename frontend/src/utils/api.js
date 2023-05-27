import { BASE_AUTH_URL } from "./auth";

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

  getInitialCards(jwt) {
    return this._request(`${this._baseUrl}/cards/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      }
    })
  }

  addCard(cardData, jwt) {
    return this._request(`${this._baseUrl}/cards/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    });
  }

  deleteCard(cardId, jwt) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
    });
  }

  getUserInfo(jwt) {
    return this._request(`${this._baseUrl}/users/me/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      }
    });
  }

  setUserInfo(newData, jwt) {
    return this._request(`${this._baseUrl}/users/me/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: newData.name,
        about: newData.about,
      }),
    });
  }

  setUserAvatar(data, jwt) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }

  changeLikeCardStatus(id, isLiked, jwt) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._headers,
        method: "PUT",
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        method: "DELETE",
      });
    }
  }
}

const api = new Api({
  baseUrl: BASE_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
  },
});

export default api;
//
