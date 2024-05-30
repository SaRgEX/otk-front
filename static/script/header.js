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
        window.location.href = 'http://localhost/my/order';
    }
}

function ToHome() {
    window.location.href = 'http://localhost/';
}

function ToProfile() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/my/profile';
    } else {
        showAuthorizationDialog();
    }
}

function ToFavourite() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/my/favorite';
    }
}

function ToCart() {
    if (isAuthorize()) {
        window.location.href = 'http://localhost/my/cart';
    }
}

function isAuthorize() {
    if (localStorage.getItem('token')) {
        return true;
    } else {
        return false;
    }
}