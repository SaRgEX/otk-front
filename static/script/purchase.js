let id = window.location.pathname.split('/')[3];
console.log(id)
const container = document.getElementsByClassName('container')[0];

fetch('http://localhost:8080/api/order/' + id + "/", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
})
    .then(response => response.json())
    .then(data => {
        let purchase = createHTMLFromData(data)
        container.innerHTML = purchase
    })


function createHTMLFromData(data) {

    let html = `
    <div class="purchase-container">
        <div class="purchase-info">
            <div class="purchase-address">
                <h2>Адрес доставки
                </h2>
                <p>г. ${data.order.city} ул. ${data.order.street} д. ${data.order.house} кв. ${data.order.apartment}</p>
            </div>
            <div class="purchase-status">
                <h2>Статус</h2>
                <p>${data.order.status}</p>
            </div>
            <div class="purchase-price">
                <h2>Стоимость</h2>
                <p>${getPrice(data.purchase)} ₽</p>
            </div>
        </div>
    </div>
    `
    return html
}

function getPrice(purchase) {
    total = 0;
    purchase.forEach(element => {
        total += Number(element.price / 100 * element.amount);
    });
    return total
}