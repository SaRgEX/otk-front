let id = localStorage.getItem('id')
document.title = id;
const container = document.getElementsByClassName('container')[0]
const product = document.getElementsByClassName('product')[0]
const productName = document.getElementById('product-name')
fetch('http://localhost:8080/products/' + id + "/", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080',
    },
})
.then(response => response.json())
.then(data => {
    const containerProduct = document.createElement('div');
    containerProduct.className = "container-product";
    const productDetails = document.createElement('div');
    productDetails.className = "product-details";
    const image = document.createElement('img');
    const article = document.createElement('p');
    article.className = "product-article";
    const description = document.createElement('p');
    article.innerHTML = "Артикул: " + data.article;
    productName.innerHTML = data.name;
    description.innerHTML = data.description;
    document.getElementById('price').innerText += data.price / 100 + " ₽";
    document.getElementById('amount').innerText += data.amount;
    image.src = "../" + data.image;
    image.onerror = function () { this.src = "/images/empty.png" }
    image.width = 250;
    image.height = 250;
    productDetails.appendChild(image);
    productDetails.appendChild(article);
    containerProduct.appendChild(productDetails);
    containerProduct.appendChild(description);
    product.appendChild(containerProduct);
})

const amount = 1
function addToCart() {
    const order = {
        product_article: Number(localStorage.getItem('id')),
        amount: Number(amount)
    }

    fetch('http://localhost:8080/api/cart/', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8080',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }

    }).then(response => {
        response.text().then(text => {
            let json = JSON.parse(text);
            if (json.status == 200) {
                alert('Заказ оформлен');
            }
        })
    }).catch(error => {
        console.error('Error:', error);
        alert('Заказ не оформлен');
    })
}

function addToFavorite() {
    fetch('http://localhost:8080/api/favorite/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8080',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({product_article: Number(localStorage.getItem('id'))})
    }).then(response => {
        response.text().then(text => {
            let json = JSON.parse(text);
            if (json.status === 200) {
                alert('Товар добавлен в избранное');
            }
        })
    }).catch(error => {
        console.error('Error:', error);
        alert('Товар не добавлен в избранное');
    })
}