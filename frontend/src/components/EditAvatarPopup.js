import React from "react";
import PopupWithForm from "./PopupWithForm";
import useValidation from "../hooks/useValidation.js";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatar = React.useRef("");
  const { values, errors, isFormValid, onChange, resetValidation } =
    useValidation();

  React.useEffect(() => {
    resetValidation();
  }, [isOpen, resetValidation]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatar.current.value,
    });
  }
  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="avatar"
      title="Обновить аватар"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      isValid={isFormValid}
    >
      <input
        value={values.link || ""}
        onChange={onChange}
        type="url"
        id="link"
        className={`popup__input ${
          errors.link ? "popup__input_type_error" : ""
        }`}
        placeholder="Ссылка на изображение"
        name="link"
        required
        ref={avatar}
      />
      <span
        id="avatar-error"
        className={`popup__error ${errors.link ? "popup__error_visible" : ""}`}
      >
        {errors.link}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
