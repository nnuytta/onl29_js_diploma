export const createButton = (text, className) => {
    const button = document.createElement('button');
    const buttonText = document.createTextNode(text);
    button.className = className;
    button.append(buttonText);

    return button;
};

export const createModal = (picture) => {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.style.display = 'none';
    modalContainer.id = `modal-${picture.id}`;

    const addToBoardButton = createButton('Добавить на доску', 'modal-button');
    addToBoardButton.id = `add-${picture.id}`;
    const hideButton = createButton('Скрыть пин', 'modal-button');
    hideButton.id = `hide-${picture.id}`;
    const reportButton = createButton('Пожаловаться на пин', 'modal-button');
    reportButton.id = `report-${picture.id}`;

    modalContainer.append(addToBoardButton);
    modalContainer.append(hideButton);
    modalContainer.append(reportButton);

    return modalContainer;
};

const createRadio = (value, id) => {
    const radioWrap = document.createElement('div');
    radioWrap.className = 'report-modal-form-radio';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'reportVariants';
    radio.value = value;
    radio.id = id;

    const label = document.createElement('label');
    label.htmlFor = id;
    label.innerText = value;

    radioWrap.append(radio);
    radioWrap.append(label);

    return radioWrap;
}

export const createReportModal = (modal) => {
    const modalId = modal.id.split('-')[1];

    const reportModalContainer = document.createElement('div');
    reportModalContainer.className = 'report-modal';
    reportModalContainer.id = `reportModal-${modalId}`;

    const h2 = document.createElement('h2');
    h2.className = 'report-h2';
    h2.innerText = 'Жалоба на пин';

    const form = document.createElement('form');
    form.className = 'report-modal-form';

    form.append(createRadio('Спам', 'radio1'));
    form.append(createRadio('Изображения обнаженного тела или порнография', 'radio2'));
    form.append(createRadio('Членовредительство', 'radio3'));
    form.append(createRadio('Ложная информация', 'radio4'));
    form.append(createRadio('Агрессивные действия', 'radio5'));
    form.append(createRadio('Опасные товары', 'radio6'));
    form.append(createRadio('Преследование или нарушение конфиденциальности', 'radio7'));
    form.append(createRadio('Сцены насилия', 'radio8'));
    form.append(createRadio('Это моя интеллектуальная собственность', 'radio9'));

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'report-buttons';

    const sendBtn = document.createElement('button');
    sendBtn.className = 'send';
    sendBtn.innerText = 'Отправить';
    sendBtn.id = `send-${modalId}`;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel';
    cancelBtn.innerText = 'Отмена';
    cancelBtn.id = `cancel-${modalId}`;

    buttonsDiv.append(cancelBtn);
    buttonsDiv.append(sendBtn);

    reportModalContainer.append(h2);
    reportModalContainer.append(form);
    reportModalContainer.append(buttonsDiv);

    return reportModalContainer;
}

export const createNewOption = (name) => {
    let option = document.createElement('option');
    option.value = name.split(' ').join('');
    option.innerText = name;
    let select = document.getElementById('boards');
    select.append(option);
}

export const createBoard = (name, allBoards) => {
    let board = { 
        name: name,
        pictures: [],
    };

    createNewOption(name);

    allBoards.push(board);    
}

export const addBlur = (container) => {
    let blur = document.createElement('div');
    blur.className = 'blur';
    blur.style.display = 'block';

    container.append(blur);
}

export const removeBlur = () => {
    let blur = document.getElementsByClassName('blur')[0];
    blur.remove();
}
