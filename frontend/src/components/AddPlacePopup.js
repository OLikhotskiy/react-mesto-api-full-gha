import React from "react";
import PopupWithForm from "./PopupWithForm";
import useValidation from "../hooks/useValidation.js";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const { values, errors, isFormValid, onChange, resetValidation } =
    useValidation();

  React.useEffect(() => {
    resetValidation();
  }, [isOpen, resetValidation]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace(values);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="add"
      title="Новое место"
      buttonText="Создать"
      onSubmit={handleSubmit}
      isValid={isFormValid}
    >
      <input
        className={`popup__input ${
          errors.name ? "popup__input_form_type_error" : ""
        }`}
        type="text"
        id="title"
        name="name"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        required
        value={values.name || ""}
        onChange={onChange}
      />
      <span
        id="title-error"
        className={`popup__error ${errors.name ? "popup__error_visible" : ""}`}
      >
        {errors.name || ""}
      </span>
      <input
        className={`popup__input ${
          errors.link ? "popup__input_type_error" : ""
        }`}
        type="url"
        id="picture"
        name="link"
        placeholder="Ссылка на картинку"
        required
        value={values.link || ""}
        onChange={onChange}
      />
      <span
        id="picture-error"
        className={`popup__error ${errors.link ? "popup__error_visible" : ""}`}
      >
        {errors.link || ""}
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
