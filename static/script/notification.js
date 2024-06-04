export class Notification {
    constructor() {}

    ErrorMessage(text) {
        showNotification('#ff434396', text);
    }
    
    SuccessMessage(text) {
        showNotification('#58ff58a1', text);
    }
}

const messageContainer = document.getElementById('notification');

function showNotification(backgroundColor, text) {
    createNotificationBox(backgroundColor, text);
}

function createNotificationBox(backgroundColor, text) {
    let messageBox = document.createElement('div')
    messageBox.classList.add('notification-message');
    messageBox.id = 'notification-message';
    let messageText = document.createElement('p')
    messageText.innerText = text
    messageBox.appendChild(messageText);
    messageContainer.prepend(messageBox);
    messageBox.style.backgroundColor = backgroundColor;
    deleteMessage(messageBox);
}

function deleteMessage(message) {
    fadeOut(message);
    setInterval(() => {
        message.remove();
    }, 3000);
}

function fadeOut(element) {
    setInterval(() => {
        element.style.opacity = 0;
        element.style.top = "100px";
    }, 2000)   
}
