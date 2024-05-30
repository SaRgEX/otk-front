authorizationDialog = document.getElementById("authorizationDialog");
registrationDialog = document.getElementById("registrationDialog");

function isAuthorized() {
    fetch('http://' + location.host + '/api/my/profile/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (response.status == 401) {
                showAuthorizationDialog();
                return;
            } else {
                profile();
            }
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
}

function performAuthorization(login, password) {
    if (!validate(login, password)) {
        return;
    }
    var data = {
        "login": login,
        "password": password
    };
    console.log(location.host);
    fetch('http://' + location.host + '/api/auth/sign-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // тип содержимого
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            checkAuthorization()
            if (response.status !== 200) {
                return;
            } else {
                hideAuthorizationDialog();
                profile();
                return response.json();
            }
        })
        .then(data => {
            const token = data.token
            if (token) {
                localStorage.setItem('token', token);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
}

function cancelAuthorization() {
    hideAuthorizationDialog();
}

function cancelRegistration() {
    hideRegistrationDialog();
}

function validate(login, password) {
    if (login.trim() === '') {
        alert('Please enter a login');
        return false;
    }

    if (password.trim() === '') {
        alert('Please enter a password');
        return false;
    }

    return true;
}

function profile() {
    window.location.href = '/my/profile';
}

function performRegistration() {
    let first_name = document.getElementById('name');
    let last_name = document.getElementById('surname');
    let patronymic = document.getElementById('patronymic');
    let login = document.getElementById('reg-login');
    let password = document.getElementById('reg-password');
    let data = {
        first_name: first_name.value,
        last_name: last_name.value,
        patronymic: patronymic.value,
        login: login.value,
        password: password.value
    };

    fetch('http://' + location.host + '/api/auth/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000/'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status !== 200) {
                return;
            } else {
                hideRegistrationDialog();
                profile();
                return response.json();
            }
        })
        .then(data => {
            const token = data.token
            if (token) {
                localStorage.setItem('token', token);
            }
        })
        .catch(error => {
            console.log(error)
        });
}

window.onload = function() {
    (function() {
        const inputText = document.querySelectorAll('.auth-form__input');

        inputText.forEach( function(input) {
            input.addEventListener('focus', function() {
                this.classList.add('focus');
                this.parentElement.querySelector('.auth-form__placeholder').classList.add('focus');
            });
            input.addEventListener('blur', function() {
                this.classList.remove('focus');
                if (! this.value) {
                    this.parentElement.querySelector('.auth-form__placeholder').classList.remove('focus');
                }
            });
        });
    })();

    (function() {
        const togglers = document.querySelectorAll('.password-toggler');

        togglers.forEach( function(checkbox) {
            checkbox.addEventListener('change', function() {

                const toggler = this.parentElement,
                      input   = toggler.parentElement.querySelector('.input-password'),
                      icon    = toggler.querySelector('.auth-form__icon');

                if (checkbox.checked) {
                    input.type = 'text';
                    icon.classList.remove('la-eye')
                    icon.classList.add('la-eye-slash');
                }

                else
                {
                    input.type = 'password';
                    icon.classList.remove('la-eye-slash')
                    icon.classList.add('la-eye');
                }
            });
        });
    })();

    (function() {
            document.forms['form-auth'].addEventListener('submit', function(e) {
            e.preventDefault();

            const answerContainer = this.querySelector('.auth-form__answer'),
                  login = this.elements.login.value,
                  password = this.elements.password.value;

            performAuthorization(login, password);
        });
    })();
};

function showAuthorizationDialog() {
    hideRegistrationDialog();
    document.getElementById("authorizationDialog").style.display = "flex";
}

function showRegistrationDialog() {
    hideAuthorizationDialog();
    document.getElementById("registrationDialog").style.display = "flex";
}

function hideAuthorizationDialog() {
    document.getElementById("authorizationDialog").style.display = "none";
}

function hideRegistrationDialog() {
    document.getElementById("registrationDialog").style.display = "none";
}

function checkAuthorization() {
    const answerContainer = document.querySelector('.auth-form__answer')
    const placeholders = document.querySelectorAll('.auth-form__placeholder');
    const inputs = document.querySelectorAll('.auth-form__input');
    placeholders.forEach(function(placeholder) {
        placeholder.classList.remove('focus');
    });
    inputs.forEach( function(input) {
        input.value = '';
        input.classList.remove('focus');
    });
    answerContainer.innerHTML = '<span class="text-danger">неправильный логин или пароль</span>';
}