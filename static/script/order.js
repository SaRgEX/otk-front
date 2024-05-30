fetch('http://' + location.host + '/api/my/order/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json', // тип содержимого
        'Origin': 'http://localhost:3000', // разрешенный источник
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
})
    .then(response => {
        if (response.status == 500) {
            return;
        } else {
            response.text().then(text => {
                let json = JSON.parse(text);
                let container = createHTMLFromData(json);
            })
        }
    })
    .then(data => {
    })
    .catch(error => {
        console.error('Error:', error);
    });

function createHTMLFromData(data) {
    const container = document.getElementsByClassName('container-order')[0];

    data.forEach(item => {
        const containerOrder = document.createElement('div');
        containerOrder.className = "container-order-item";
        containerOrder.onclick = () => viewPurchase(item.id);
        const order = document.createElement('p');
        const address = document.createElement('p');
        const status = document.createElement('p');
        var date = new Date(item.order_date);
        order.innerHTML = "Заказ от " + date.toLocaleString('ru-RU');
        address.innerHTML = item.street + " " + item.house + " " + item.apartment + " " + item.city;
        status.innerHTML = item.status;
        containerOrder.appendChild(order);
        containerOrder.appendChild(address);
        containerOrder.appendChild(status);
        container.appendChild(containerOrder);
    });
}

function viewPurchase(id) {
    window.location.href = `http://' + location.host + '/api/my/order/${id}`;
}