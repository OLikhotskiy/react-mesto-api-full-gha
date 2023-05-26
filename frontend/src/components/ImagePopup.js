import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <section
      className={`popup popup_type_image ${card.link ? "popup_is-open" : ""}`}
      aria-label="Картинки"
    >
      <figure className="popup__image-figure popup__overlay">
        <button
          aria-label="Close"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        <img className="popup__big-pic" src={card.link} alt={card.name} />
        <figcaption className="popup__image-caption">{card.name}</figcaption>
      </figure>
    </section>
  );
}

export default ImagePopup;
