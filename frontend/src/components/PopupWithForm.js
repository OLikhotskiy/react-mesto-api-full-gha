import React from "react";

function PopupWithForm({
  isOpen,
  onClose,
  name,
  title,
  buttonText,
  onSubmit,
  children,
  isValid,
}) {
  return (
    <section
      className={`popup popup_type_${name} ${isOpen ? "popup_is-open" : ""}`}
    >
      <div className="popup__container popup__overlay">
        <button
          aria-label="Close"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        <div className="popup__content">
          <h2 className="popup__title">{title}</h2>
          <form className="popup__form" name={`${name}`} onSubmit={onSubmit}>
            {children}
            <button
              aria-label="Submit"
              className={`popup__button ${
                !isValid && "popup__button_disabled"
              }`}
              type="submit"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PopupWithForm;
