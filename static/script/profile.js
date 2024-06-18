const profile = document.getElementsByClassName('profile-container')[0];
const address = document.getElementById('address');
const recentOrder = document.getElementById('recent-order-wrapper');
const addressWindow = document.getElementById('address-dialog')
const editWindow = document.getElementById('edit-dialog')
const formInputs = document.getElementById('form_inputs')
const profileContainer = document.createElement('div');
const updateInfo = document.getElementById('updateInfo');
updateInfo.onclick = () => putProfile();
profileContainer.className = 'profile-info';
let userInfo = []
fetch('http://' + location.host + '/api/my/profile/', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET'
})
    .then(response => response.json())
    .then(data => {
        userInfo.push(data.first_name)
        userInfo.push(data.last_name)
        userInfo.push(data.phone)
        userInfo.push(data.email)
        localStorage.setItem('name', data.first_name);
        const profile_name = document.createElement('p');
        const profile_surname = document.createElement('p');
        const info = document.createElement('p');
        const phoneItems = document.createElement('div');
        const phone = document.createElement('p');
        const email = document.createElement('p');
        profile_name.innerHTML = "Имя: " + data.first_name;
        document.getElementById('profile-text').textContent = data.first_name;
        profile_surname.innerHTML = "Фамилия: " + data.last_name;
        info.innerHTML = "Статус: " + data.status;
        if (data.phone) {
            phone.innerHTML = "Телефон: " + data.phone
        } else {
            phone.innerHTML = "Телефон: "
        }
        if (data.email) {
            email.innerHTML = "Email: " + data.email
        } else {
            email.innerHTML = "Email: "
        }
        profileContainer.appendChild(profile_name)
        profileContainer.appendChild(profile_surname)
        profileContainer.appendChild(info)
        profileContainer.appendChild(phone)
        profileContainer.appendChild(email)
        profile.appendChild(profileContainer)
        getAddress()
        getRecentOrders()
    })

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = 'http://' + location.host;
}

function showEditProfile() {
    editWindow.style.display = 'flex';
    editInfo();
}

function hideEditDialog() {
    editWindow.style.display = 'none';
}

function editInfo(type) {
    for (i = 0; i < formInputs.children.length - 1; i++) {
        formInputs.children[i].children[1].value = userInfo[i];
    }
}

function dataFromInputs() {
    for (i = 0; i < formInputs.children.length - 1; i++) {
        userInfo[i] = formInputs.children[i].children[1].value;
    }
    data = {
        'first_name': userInfo[0],
        'last_name': userInfo[1],
        'phone': userInfo[2],
        'email': userInfo[3]
    }
    return data;
}

function putProfile() {
    data = dataFromInputs();
    fetch('http://' + location.host + '/api/my/profile/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'PUT',
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            editWindow.style.display = 'none';
            location.href('http://' + location.host + '/my/profile');
        })
}

function editForm() {
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
            input.addEventListener('change', function() {
                this.classList.add('focus');
                this.parentElement.querySelector('.auth-form__placeholder').classList.add('focus');
            });
        });
    })();
    (function() {
        document.forms['form-address'].addEventListener('submit', function(e) {
        e.preventDefault();
        putProfile();
    });
})();
}

function getAddress() {
    fetch('http://' + location.host + '/api/my/address/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            let addressSelector = document.querySelector('#address-selector');
            for (let i = 0; i < data.address.length; i++) {
                let option = document.createElement('option');
                option.textContent = option.value = data.address[i].city + ", " + data.address[i].street + ", " + data.address[i].house + ", офис " + data.address[i].apartment
                addressSelector.append(option)
            }
        })
}

function addAdress() {
    fetch('http://' + location.host + '/api/my/address/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'POST',
        body: address.value
    })
        .then(response => response.json())
        .then(data => {})
}

function getRecentOrders() {
    fetch('http://' + location.host + '/api/my/order/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (data === null) {
                recentOrder.innerHTML = "Нет заказов"
            }
            else {   
                for (let i = data.length - 1; (i > data.length - 5) && (i >= 0); i--) {
                    let orderContainer = document.createElement('div');
                    orderContainer.className = 'order-container';
                    let orderDate = document.createElement('p');
                    let orderStatus = document.createElement('p');
                    var date = new Date(data[i].order_date);
                    orderDate.innerHTML = "Заказ от " + date.toLocaleString('ru-RU');
                    orderStatus.innerHTML = "Статус: " + data[i].status;
                    orderContainer.appendChild(orderDate);
                    orderContainer.appendChild(orderStatus);
                    orderContainer.onclick = function () { viewPurchase(data[i].id) }
                    recentOrder.appendChild(orderContainer);
                }
            }
            })
        }

function showAddress() {
    addressWindow.style = 'display: flex';
}

function hideAddressDialog() {
    addressWindow.style = 'display: none';
}

function viewPurchase(id) {
    window.location = 'http://' + location.host + '/my/order/' + id
}

window.onload = addressForm();

function addressForm() {
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
            input.addEventListener('change', function() {
                this.classList.add('focus');
                this.parentElement.querySelector('.auth-form__placeholder').classList.add('focus');
            });
        });
    })();
    (function() {
        document.forms['form-address'].addEventListener('submit', function(e) {
        e.preventDefault();

        const answerContainer = this.querySelector('.auth-form__answer'),
              city = this.elements.city.value,
              street = this.elements.street.value,
              house = this.elements.house.value,
              apartment = this.elements.apartment.value;
        addAddress(city, street, house, apartment);
    });
})();
}

function addAddress(city, street, house, apartment) {
    data = {
        city: city,
        postal_code: 64000,
        street: street,
        house: house,
        apartment: apartment
    }
    fetch('http://' + location.host + '/api/my/address/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log(response.status)
            if (response.status === 200) {
                return response.json();
            }
            else {
                return;
            }
        })
        .then(data => {})
}