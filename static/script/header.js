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
        window.location.href = 'http://' + location.host + '/my/order';
    }
}

function ToHome() {
    window.location.href = 'http://' + location.host + '/';
}

function ToProfile() {
    if (isAuthorize()) {
        window.location.href = 'http://' + location.host + '/my/profile';
    }
}

function ToFavourite() {
    if (isAuthorize()) {
        window.location.href = 'http://' + location.host + '/my/favorite';
    }
}

function ToCart() {
    if (isAuthorize()) {
        window.location.href = 'http://' + location.host + '/my/cart';
    }
}

function isAuthorize() {
    if (localStorage.getItem('token')) {
        return true;
    } else {
        showAuthorizationDialog();
        return false;
    }
}