const profileName = document.getElementById('profile-text');
let first_name = localStorage.getItem('name')
getName();
function getName() {
    if (isNaN(first_name)) {
        profileName.innerHTML = first_name;
    } else {
        profileName.innerHTML = 'Войти';
    }
}

function ToOrder() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/api/order';
    }
}

function ToHome() {
    window.location.href = 'http://localhost/';
}

function ToProfile() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/api/profile';
    } else {
        showAuthorizationDialog();
    }
}

function ToFavourite() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/api/favourite';
    }
}

function ToCart() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/api/cart';
    }
}

function isAuthorize() {
    if (localStorage.getItem('token')) {
        return true;
    } else {
        return false;
    }
}