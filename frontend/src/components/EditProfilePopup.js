import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import useValidation from "../hooks/useValidation.js";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);

  const { values, errors, isFormValid, onChange, resetValidation } =
    useValidation();

  React.useEffect(() => {
    resetValidation(true, currentUser);
  }, [currentUser, isOpen, resetValidation]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser(values);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="edit"
      title="Редактировать профиль"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      isValid={isFormValid}
    >
      <input
        className={`popup__input popup__input_type_name ${
          errors.name ? "popup__input_type_error" : ""
        }`}
        type="text"
        id="name"
        placeholder="Имя пользователя"
        name="name"
        minLength="2"
        maxLength="40"
        required
        onChange={onChange}
        value={values.name || ""}
      />
      <span
        id="name-error"
        className={`popup__error ${errors.name ? "popup__error_visible" : ""}`}
      >
        {errors.name || ""}
      </span>
      <input
        className={`popup__input popup__input_type_about ${
          errors.about ? "popup__input_type_error" : ""
        }`}
        type="text"
        id="about"
        placeholder="Информация о пользователе"
        name="about"
        minLength="2"
        maxLength="200"
        required
        onChange={onChange}
        value={values.about || ""}
      />
      <span
        id="about-error"
        className={`popup__error ${errors.about ? "popup__error_visible" : ""}`}
      >
        {errors.about || ""}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
