let id = window.location.pathname.split('/')[3];
console.log(id)
const container = document.getElementsByClassName('container')[0];

fetch('http://' + location.host + '/api/my/order/' + id + "/", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let purchase = createHTMLFromData(data)

        container.innerHTML = purchase
        products = document.getElementById('products');
    
        console.log(products)
        for (let i = 0; i < data.purchase.length; i++) {
            products.innerHTML += createHTMLFromProduct(data.purchase[i])
        }
    })


function createHTMLFromProduct(data) {
    let html = `
    <div class="product-container">
        <div class="product-image">
            <img src="/${data.image}" alt="">
        </div>
        <div class="product-info">
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <p>Цена за ед. ${data.price / 100} ₽</p>
            <p>Количество: ${data.amount}</p>
        </div>
    </div>
    `
    return html
}

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
            <div class="purchase-products" id="products">
            </div>
            </div>
        <div class="purchase-price">
            <p>Итого: ${getPrice(data.purchase)} ₽</p>
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