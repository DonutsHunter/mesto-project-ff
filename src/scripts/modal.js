// Функция открытия модального окна
export function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeModalOnEsc);
    modal.addEventListener('click', closeModalOnOverlay);
  }
  
  // Функция закрытия модального окна
  export function closeModal(modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeModalOnEsc);
    modal.removeEventListener('click', closeModalOnOverlay);
  }
  
  // Закрытие модального окна по нажатию на Esc
  function closeModalOnEsc(evt) {
    if (evt.key === 'Escape') {
      const openedModal = document.querySelector('.popup_is-opened');
      closeModal(openedModal);
    }
  }
  
  // Закрытие модального окна по клику на оверлей
  function closeModalOnOverlay(evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(evt.currentTarget);
    }
  }