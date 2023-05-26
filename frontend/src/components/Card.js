import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleClick() {
    onCardClick(card);
  }

  return (
    <article className="element">
      <img
        className="element__picture"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      {isOwn && (
        <button
          aria-label="Delete"
          className="element__trash"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="element__content">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__likes-container">
          <button
            aria-label="Like"
            className={`element__like ${isLiked && "element__like_active"}`}
            type="button"
            onClick={handleLikeClick}
          />

          <p className="element__likes-number">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
