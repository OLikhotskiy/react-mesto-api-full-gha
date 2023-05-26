import React from "react";

function useValidation() {
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [isFormValid, setFormValid] = React.useState(false);

  function onChange(evt) {
    const { name, value } = evt.target;
    const error = evt.target.validationMessage;
    const formValid = evt.target.closest("form").checkValidity();
    setValues((values) => ({ ...values, [name]: value }));
    setErrors((errors) => ({ ...errors, [name]: error }));
    setFormValid(formValid);
  }

  const resetValidation = React.useCallback(
    (isFormValid = false, values = {}, errors = {}) => {
      setFormValid(isFormValid);
      setValues(values);
      setErrors(errors);
    },
    [setFormValid, setValues, setErrors]
  );

  return {
    values,
    errors,
    isFormValid,
    onChange,
    resetValidation,
  };
}

export default useValidation;
