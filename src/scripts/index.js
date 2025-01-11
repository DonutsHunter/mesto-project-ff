import "../pages/index.css";
import { createCard, handleDeleteCard, handleLikeCard } from '../components/card.js';
import { openModal, closeModal } from '../components/modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { addCard, setLike, deleteCardFromServer, getInitialCards, getUserInfo, updateUserInfo, updateUserAvatar } from './api.js';

// DOM-элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileEditModal = document.querySelector('.popup_type_edit');
const cardAddModal = document.querySelector('.popup_type_new-card');
const avatarElement = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileForm = document.forms['edit-profile'];
const cardForm = document.forms['new-place'];
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');

// Элементы модального окна с изображением
const imageModal = document.querySelector('.popup_type_image');
const imageModalImage = imageModal.querySelector('.popup__image');
const imageModalCaption = imageModal.querySelector('.popup__caption');

const avatarModal = document.querySelector('.popup_type_avatar');
const avatarForm = document.forms['edit-avatar'];
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_url');

// Модальное окно удаления карточки
const deleteCardModal = document.querySelector('.popup_type_delete_card');

// Кнопки закрытия модальных окон
const closeButtons = document.querySelectorAll('.popup__close');

let userId;

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input_error_visible'
};

// Загрузка данных пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    const { name, about, avatar, _id } = user;
    fillProfileWithResponse(name, about, avatar);
    userId = _id;

    cards.forEach(card => {
      const cardElement = createCard(card, userId, handleDeleteCard, deleteCardFromServer, openModal, closeModal, deleteCardModal, handleLikeCard, setLike, openImageModal);
      placesList.append(cardElement);
    });
  })
  .catch((error) => {
    console.log(`Ошибка при загрузке данных: ${error}`);
  });

// Добавляем анимацию всем модальным окнам при загрузке страницы
document.querySelectorAll('.popup').forEach((modal) => {
  modal.classList.add('popup_is-animated');
});

// Заполнение профиля данными
function fillProfileWithResponse(name, about, avatarUrl) {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  avatarElement.style.backgroundImage = `url(${avatarUrl})`;
}

// Открытие модального окна редактирования профиля
profileEditButton.addEventListener('click', () => {
  profileForm.elements.name.value = profileTitle.textContent;
  profileForm.elements.description.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profileEditModal);
});

// Открытие модального окна добавления карточки
profileAddButton.addEventListener('click', () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModal(cardAddModal);
});

// Добавляем обработчики закрытия для всех модальных окон
closeButtons.forEach((button) => {
  const modal = button.closest('.popup');
  button.addEventListener('click', () => closeModal(modal));
});

// Обработчик отправки формы редактирования профиля
profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const name = profileForm.elements.name.value;
  const description = profileForm.elements.description.value;

  updateUserInfo({ name, about: description })
    .then((updatedUser) => {
      fillProfileWithResponse(updatedUser.name, updatedUser.about, updatedUser.avatar);
      closeModal(profileEditModal);
    })
    .catch((error) => {
      console.log(`Ошибка при обновлении профиля: ${error}`);
    });
});

// Обработчик отправки формы добавления карточки
cardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  addCard(newCard)
    .then((card) => {
      const cardElement = createCard(card, userId, handleDeleteCard, deleteCardFromServer, openModal, closeModal, deleteCardModal, handleLikeCard, setLike, openImageModal);
      placesList.prepend(cardElement);
      closeModal(cardAddModal);
      cardForm.reset();
    })
    .catch((error) => {
      console.log(`Ошибка при добавлении карточки: ${error}`);
    });
});

avatarElement.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const avatarUrl = avatarLinkInput.value;

  updateUserAvatar({ avatar: avatarUrl })
    .then((updatedUser) => {
      fillProfileWithResponse(updatedUser.name, updatedUser.about, updatedUser.avatar);
      closeModal(avatarModal);
    })
    .catch((error) => {
      console.log(`Ошибка при обновлении аватара: ${error}`);
    });
});

// Функция открытия модального окна с изображением
function openImageModal(cardData) {
  imageModalImage.src = cardData.link;
  imageModalImage.alt = cardData.name;
  imageModalCaption.textContent = cardData.name;
  openModal(imageModal);
}

// Включение валидации форм
enableValidation(validationConfig);