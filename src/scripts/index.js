import "../pages/index.css";
import { openModal, closeModal } from './modal.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { initialCards } from './cards.js';

// DOM-элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileEditModal = document.querySelector('.popup_type_edit');
const cardAddModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileForm = document.forms['edit-profile'];
const cardForm = document.forms['new-place'];
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');

// Открытие модального окна редактирования профиля
profileEditButton.addEventListener('click', () => {
  profileForm.elements.name.value = profileTitle.textContent;
  profileForm.elements.description.value = profileDescription.textContent;
  openModal(profileEditModal);
});

// Открытие модального окна добавления карточки
profileAddButton.addEventListener('click', () => {
  cardForm.reset();
  openModal(cardAddModal);
});

// Закрытие модальных окон
document.querySelectorAll('.popup__close').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.popup');
    closeModal(modal);
  });
});

// Обработчик отправки формы редактирования профиля
profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = profileForm.elements.name.value;
  profileDescription.textContent = profileForm.elements.description.value;
  closeModal(profileEditModal);
});

// Обработчик отправки формы добавления карточки
cardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = createCard(newCard, deleteCard, likeCard, openImageModal);
  placesList.prepend(cardElement);
  closeModal(cardAddModal);
});

// Функция открытия модального окна с изображением
function openImageModal(cardData) {
  const imageModalImage = imageModal.querySelector('.popup__image');
  const imageModalCaption = imageModal.querySelector('.popup__caption');
  imageModalImage.src = cardData.link;
  imageModalImage.alt = cardData.name;
  imageModalCaption.textContent = cardData.name;
  openModal(imageModal);
}

// Инициализация карточек из массива initialCards
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard, likeCard, openImageModal);
  placesList.appendChild(cardElement);
});