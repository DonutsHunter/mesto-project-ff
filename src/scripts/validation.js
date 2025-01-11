function setInputEventListeners(form, config) {
  const formInputs = Array.from(form.querySelectorAll(config.inputSelector));
  const formSubmitButton = form.querySelector(config.submitButtonSelector);
  toggleSubmitButtonState(formInputs, formSubmitButton);
  formInputs.forEach((input) => {
    input.addEventListener('input', () => {
      validation(form, input);
      toggleSubmitButtonState(formInputs, formSubmitButton);
    });
  });
}

export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((formElement) => {
    setInputEventListeners(formElement, validationConfig);
  });
}

function showInputError(form, input, errorMessage) {
  const inputError = form.querySelector(`.${input.id}-error`);
  input.classList.add('popup__input_type_error');
  inputError.textContent = errorMessage;
  inputError.classList.add('popup__input_error_visible');
}

function hideInputError(form, input) {
  const inputError = form.querySelector(`.${input.id}-error`);
  input.classList.remove('popup__input_type_error');
  inputError.classList.remove('popup__input_error_visible');
  inputError.textContent = "";
}

function validation(form, input) {
  const inputName = input.getAttribute('name');
  if (!input.validity.valid) {
    if (input.validity.valueMissing) {
      showInputError(form, input, `Вы пропустили это поле`);
    }
    if (input.validity.tooShort) {
      showInputError(form, input, `Минимальное количество символов: ${input.getAttribute("minlength")}. Длина текста сейчас: ${input.value.length}`);
    }
    if (input.validity.tooLong) {
      showInputError(form, input, `Максимальное количество символов: ${input.getAttribute("maxlength")}. Длина текста сейчас: ${input.value.length}`);
    }
    if ((inputName === 'link' || inputName === 'avatar-link') && input.validity.patternMismatch) {
      showInputError(form, input, `Допустимы только валидные ссылки`);
    }
    if (inputName !== 'link' && inputName !== 'avatar-link' && input.validity.patternMismatch) {
      showInputError(form, input, input.getAttribute('data-error'));
    }
  } else {
    hideInputError(form, input);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {

    return !inputElement.validity.valid;
  })
};

function toggleSubmitButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button_disabled');
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button_disabled');
  }
}

export function clearValidation(form, validationConfig) {
  const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector));
  const submitButton = form.querySelector(validationConfig.submitButtonSelector);
  inputList.forEach((input) => {
    hideInputError(form, input);
  });
  toggleSubmitButtonState(inputList, submitButton);
}