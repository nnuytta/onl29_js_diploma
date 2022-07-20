'use strict'

import {BOARDS_KEY} from './constants.js';
import {createButton, createModal, createReportModal, createNewOption, createBoard, addBlur, removeBlur} from './utils.js';
import {httpGET} from './api.js';

let allBoards = [];
let allPics = [];
let allUsers = [];
const container = document.getElementsByClassName('container')[0];
const body = document.getElementsByTagName('body')[0];

addCreateBoardModal();

initialPrint();

const getPictures = () => {
    httpGET('https://62d6792d15ad24cbf2d82909.mockapi.io/pin')
        .then(res => {
            res.forEach(createPictureElement);
            res.forEach(element => {
                allPics.push(element);
            });
        })
}

const getUsers = () => {
    httpGET('https://62d6792d15ad24cbf2d82909.mockapi.io/users')
        .then(res => {
            res.forEach(element => {
                allUsers.push(element);
            });
        })
}

getUsers();
getPictures();

function createPictureElement(picture) {
    let pictureDiv = document.createElement('div');
    pictureDiv.className = 'picture';
    pictureDiv.id = `picture-${picture.id}`;
    let pictureImg = document.createElement('div');
    pictureImg.className = 'picture-img';
    pictureImg.innerHTML = `<img src="${picture.imageUrl}" alt="#">`

    let moreBtnDiv = document.createElement('div');
    moreBtnDiv.className = 'picture-img-btn';
    let moreBtn = document.createElement('button');
    moreBtn.className = 'more-btn';
    moreBtn.id = `more-${picture.id}`;
    moreBtn.innerHTML = '...';

    moreBtnDiv.appendChild(moreBtn);

    pictureImg.appendChild(moreBtnDiv);

    let pictureInfoDiv = document.createElement('div');
    pictureInfoDiv.className = 'picture-info';

    let pictureInfoAvatar = document.createElement('div');
    pictureInfoAvatar.className = 'picture-info-avatar';
    let avatar = document.createElement('img');
    avatar.src = allUsers.filter(user => user.username == picture.username)[0].avatar;
    pictureInfoAvatar.appendChild(avatar);

    let pictureInfoCaption = document.createElement('div');
    pictureInfoCaption.innerHTML = `<p>${picture.caption}</p>`;

    pictureInfoDiv.appendChild(pictureInfoAvatar);
    pictureInfoDiv.appendChild(pictureInfoCaption);

    pictureDiv.appendChild(pictureImg);
    pictureDiv.appendChild(pictureInfoDiv);

    let modal = createModal(picture);
    pictureDiv.append(modal);

    let picturesContainer = document.getElementsByClassName('container');
    picturesContainer[0].appendChild(pictureDiv);
}

const boardsSelect = document.getElementById('boards');

const addBoardsModal = (pictureId) => {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.id = `boardModal-${pictureId}`;

    allBoards.forEach(board => {
        const boardButton = createButton(`${board.name}`, 'modal-button');
        boardButton.id = `addTo-${board.name}-${pictureId}`;

        modalContainer.append(boardButton);
    })

    return modalContainer;
}

const onMoreBtnClick = (event) => {
    if (event.target.nodeName == "BUTTON") {
        const pictureId = event.target.id.split('-')[1];
        const action = event.target.id.split('-')[0];
        const modal = document.getElementById(`modal-${pictureId}`);
        const boardsModal = document.getElementById(`boardModal-${pictureId}`);
        const picture = document.getElementById(`picture-${pictureId}`);
        let currentPicture = allPics.filter(pic => pic.id == pictureId)[0];

        if (action == 'more') {
            if (modal.style.display == "none") {
                modal.style.display = "flex";
                modalOpened = true;
            } else {
                modal.style.display = "none";
                modalOpened = false;
            }
        }
        if (action == 'add') {
            modal.style.display = "none";
            let boardsModal = addBoardsModal(pictureId);
            const currentModal = document.getElementById(`boardModal-${pictureId}`);
            if (currentModal) {
                picture.replaceChild(boardsModal, currentModal);
                boardsModal.style.display = 'flex';
            } else {
                picture.append(boardsModal);
                boardsModal.style.display = 'flex';
                boardsModal.style.flexDirection = 'column';
            }
        }
        if (action == 'hide') {
            picture.remove();
        }
        if (action == 'report') {
            const reportModal = createReportModal(modal);
            container.append(reportModal);
            
            modal.style.display = "none";
            body.style.height = '100%';
            body.style.overflow = 'hidden';

            addBlur(container);
        }
        if (action == 'cancel') {
            const reportModal = document.getElementById(`reportModal-${pictureId}`);
            removeBlur();
            reportModal.remove();
            picture.remove();
        }
        if (action == 'send') {
            const reportModal = document.getElementById(`reportModal-${pictureId}`);
            const radios = document.getElementsByName('reportVariants');

            radios.forEach(radio => {
                if (radio.checked) {
                    alert(`Пин был скрыт за ${radio.value.toLowerCase()}`);
                }
            })

            removeBlur();
            reportModal.remove();
            picture.remove();
            body.style.height = 'auto';
            body.style.overflow = 'auto';
        }
    }
}

const onAddToBtnClick = (event) => {
    if (event.target.nodeName == "BUTTON") {
        const boardName = event.target.id.split('-')[1];
        const pictureId = event.target.id.split('-')[2];
        const modal = document.getElementById(`boardModal-${pictureId}`);
        const action = event.target.id.split('-')[0];
        let currentPicture = allPics.filter(pic => pic.id == pictureId)[0];
        if (action == 'addTo') {
            const selectedBoard = allBoards.filter(board => board.name == boardName)[0];
            
            selectedBoard.pictures.push(currentPicture);
            modal.style.display = 'none';

            localStorage.setItem(BOARDS_KEY, JSON.stringify(allBoards));
        }
    }
}

const changeBoard = (event) => {
    const selectedBoard = document.getElementById('boards').value;
    allBoards.forEach(board => {
        if (board.name == selectedBoard) {
            container.replaceChildren();
            board.pictures.forEach(createPictureElement);
        }
    })
    addCreateBoardModal();
    const confirmNewBoardName = document.getElementById('confirmNewBoardName');
    confirmNewBoardName.addEventListener('click', createNewBoard);
} 

boardsSelect.addEventListener('change', changeBoard);

container.addEventListener('click', onMoreBtnClick);
container.addEventListener('click', onAddToBtnClick);

function addCreateBoardModal() {
    const modal = document.createElement('div');
    modal.className = 'create-board-modal';
    modal.style.display = 'none'

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'newBoardName';
    nameInput.placeholder = 'Название доски';

    const confirmNameButton = document.createElement('button');
    confirmNameButton.innerText = 'Создать';
    confirmNameButton.id = 'confirmNewBoardName';

    modal.append(nameInput);
    modal.append(confirmNameButton);

    container.append(modal);
}

function showCreateBoardModal() {
    const modal = document.getElementsByClassName('create-board-modal')[0];
    addBlur(container);
    modal.style.display = 'flex';
}

const goToMain = () => {
    allPics.length = 0;
    document.getElementById('boards').value = 'Выбрать доску';
    container.replaceChildren();
    getPictures();
    addCreateBoardModal();

    const confirmNewBoardName = document.getElementById('confirmNewBoardName');
    confirmNewBoardName.addEventListener('click', createNewBoard);
    search.value = null;
}

const mainBtn = document.getElementById('main-btn');
mainBtn.addEventListener('click', goToMain);

const createBoardButton = document.getElementById('createBoard');
createBoardButton.addEventListener('click', showCreateBoardModal);

const confirmNewBoardName = document.getElementById('confirmNewBoardName');
confirmNewBoardName.addEventListener('click', createNewBoard);

function createNewBoard() {
    const newName = document.getElementById('newBoardName');

    createBoard(newName.value, allBoards);

    newName.value = null;

    const modal = document.getElementsByClassName('create-board-modal')[0];
    modal.style.display = 'none';
    removeBlur();
    localStorage.setItem(BOARDS_KEY, JSON.stringify(allBoards));
}

const showResults = () => {
    let res = searchPictures(search.value);
    container.replaceChildren();

    res.forEach(createPictureElement);

    addCreateBoardModal();
    const confirmNewBoardName = document.getElementById('confirmNewBoardName');
    confirmNewBoardName.addEventListener('click', createNewBoard);
}

const search = document.getElementById('search');
search.addEventListener('change', showResults);

function searchPictures(tag) {
    let result = [];

    allPics.forEach(picture => {
        if (picture.tags.includes(tag)) {
            result.push(picture);
        }
    });

    return result;
}

function initialPrint() {
    const savedBoards = JSON.parse(localStorage.getItem(BOARDS_KEY));

    if (savedBoards) {
        console.log("hi");
        savedBoards.forEach(board => {
            createNewOption(board.name);
            allBoards.push(board);
        })
    }
}