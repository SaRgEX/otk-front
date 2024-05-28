const profile = document.getElementsByClassName('profile-container')[0];
const address = document.getElementById('address');
const recentOrder = document.getElementById('recent-order-wrapper');
fetch('http://localhost:8080/api/profile/', {
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
    window.location.href = 'http://localhost/';
}

function getAddress() {
    fetch('http://localhost:8080/api/address/', {
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
                option.textContent = option.value = "ул. " + data.address[i].street + ", дом " + data.address[i].house
                addressSelector.append(option)
            }
        })
}

function addAdress() {
    fetch('http://localhost:8080/api/address/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'POST',
        body: address.value
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

function getRecentOrders() {
    fetch('http://localhost:8080/api/order/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data === null) {
                recentOrder.innerHTML = "Нет заказов"
            }
            else {   
                for (let i = data.length - 1; i > data.length - 5; i--) {
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
        
function viewPurchase(id) {
    window.location = 'http://localhost/api/order/' + id
}