const profile = document.getElementsByClassName('profile-container')[0];
const address = document.getElementById('address');
const recentOrder = document.getElementById('recent-order-wrapper');
const addressWindow = document.getElementById('address-dialog')
fetch('http://' + location.host + '/api/my/profile/', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    method: 'GET'
})
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('name', data.first_name);
        const profileContainer = document.createElement('div');
        profileContainer.className = 'profile-info';
        const profile_name = document.createElement('p');
        const profile_surname = document.createElement('p');
        const info = document.createElement('p');
        profile_name.innerHTML = "Имя: " + data.first_name;
        document.getElementById('profile-text').textContent = data.first_name;
        profile_surname.innerHTML = "Фамилия: " + data.last_name;
        info.innerHTML = "Статус: " + data.status;
        profileContainer.appendChild(profile_name)
        profileContainer.appendChild(profile_surname)
        profileContainer.appendChild(info)
        profile.appendChild(profileContainer)
        getAddress()
        getRecentOrders()
    })

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = 'http://' + location.host;
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