import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

import Card from "../components/Card.js";

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <main className="content">
        <section className="profile" aria-label="профайл">
          <div className="profile__avatar-container">
            <img
              className="profile__avatar"
              src={`${currentUser.avatar}`}
              alt="Аватарка"
            />
            <div className="profile__avatar-hover" onClick={onEditAvatar} />
          </div>
          <div className="profile__info">
            <div className="profile__content">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                aria-label="Edit"
                className="profile__edit"
                type="button"
                onClick={onEditProfile}
              />
            </div>
            <p className="profile__about">{currentUser.about}</p>
          </div>
          <button
            aria-label="Add"
            className="profile__add"
            type="button"
            onClick={onAddPlace}
          />
        </section>

        <section className="elements" aria-label="Карточки">
          {Array.isArray(cards)
              ? cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                link={card.link}
                name={card.name}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
              />
            ))
            : ''
          }     
        </section>
      </main>
    </CurrentUserContext.Provider>
  );
}

export default Main;
