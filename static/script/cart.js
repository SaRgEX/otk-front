const address = getAddress()
const cart = document.getElementById('container-cart');
const totalPrice = document.getElementById('total-price');
const amountInputs = [];
let productArticles = [];
let productPrice = [];
let cart_id = 0;
let total = 0;
let svgPath = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`
fetch('http://localhost:8080/api/cart/', {
    method: "GET",
    headers: {
        'Content-Type': 'application/json', // тип содержимого
        'Origin': 'http://localhost:8080', // разрешенный источник
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
})
    .then(response => response.json())
    .then(data => {
        cart_id = data.id;
        if (data.products == null) {
            cart.innerHTML = "Корзина пуста";
            return
        }
        data.products.forEach(item => {
            productArticles.push(item.article);
            const containerCart = document.createElement('div');
            containerCart.className = "container-cart-item";
            containerCart.id = item.article;
            const infoCart = document.createElement('div');
            infoCart.className = "info-cart";
            const containerAmount = document.createElement('div');
            containerAmount.className = "container-amount";
            const containerButtons = document.createElement('div');
            containerButtons.className = "container-buttons";
            const containerInfo = document.createElement('div');
            containerInfo.className = "container-info";
            const name = document.createElement('p');
            const price = document.createElement('p');
            const amount = document.createElement('input');
            amount.type = Number;
            amount.className = "amount";
            amount.onchange = () => scaleAmount(item.article, amount.valueAsNumber);
            const plus = document.createElement('button');
            plus.className = "incrementButton";
            const minus = document.createElement('button');
            minus.className = "decrementButton";
            amount.type = "number";
            amount.maxLength = 4;
            const image = document.createElement('img');
            const button = document.createElement('button');
            button.innerHTML = svgPath;
            button.id = item.article;
            button.onclick = () => deleteProduct(button.id);
            plus.innerHTML = "+";
            minus.innerHTML = "-";
            image.src = "../" + item.image;
            image.onerror = function () { this.src = "/images/empty.png" }
            image.width = 100;
            image.height = 100;
            name.innerHTML = item.name;
            total += Number(item.price / 100 * item.amount);
            price.innerHTML = item.price / 100 + " ₽";
            productPrice.push(item.price);
            amount.value = item.amount;
            amountInputs.push(amount.valueAsNumber);
            containerCart.appendChild(image);
            infoCart.appendChild(name);
            infoCart.appendChild(price);
            containerAmount.appendChild(minus);
            containerAmount.appendChild(amount);
            containerAmount.appendChild(plus);
            infoCart.appendChild(containerAmount);
            containerButtons.appendChild(button);
            containerInfo.appendChild(infoCart);
            containerInfo.appendChild(containerButtons);
            containerCart.appendChild(containerInfo);
            cart.appendChild(containerCart);
        })
    })
    .then(() => {
        totalPrice.innerHTML = "Итого: " + total + " ₽"
        onInitializate();
    })
function deleteFromCart(article) {
    data = {
        "product_article": Number(article),
        cart_id: cart_id
    }
    console.log(JSON.stringify(data))
    fetch('http://localhost:8080/api/cart/' + article + '/', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8080',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 500) {
                alert("Не удалось удалить из корзины")
            }
            else {
                cart.removeChild(document.getElementById(article))
                if (cart.children.length === 0) {
                    cart.innerHTML = "Корзина пуста"
                }
            }
        })
}

function deleteProduct(id) {
    total -= productPrice[productArticles.indexOf(Number(id))] * amountInputs[productArticles.indexOf(Number(id))].value / 100;
    deleteFromCart(id)
    updatePrice()
}

function onInitializate() {
    const incrementButtons = document.querySelectorAll('.incrementButton');
    const decrementButtons = document.querySelectorAll('.decrementButton');
    const inputs = document.querySelectorAll('input[type=number]');
    incrementButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            inputs[index].valueAsNumber++;
            scaleAmount(productArticles[index], inputs[index].valueAsNumber);
            total += productPrice[index] / 100;
            updatePrice();
        });
    });

    decrementButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (amountInputs[index] > 1) {
                inputs[index].valueAsNumber = amountInputs[index] -= 1;
                scaleAmount(productArticles[index], inputs[index].valueAsNumber);
            }
            else {
                deleteProduct(productArticles[index]);
            }
            total -= productPrice[index] / 100;
            updatePrice();
        });
    });
    amountInputs.forEach((index) => {
        refreshTotal();
    });
}

function refreshTotal() {
    total = 0; // Reset total to recalculate
    for (let i = 0; i < productArticles.length; i++) {
        total += Number(productPrice[i] / 100 * amountInputs[i]);
    }
    updatePrice();
}


function scaleAmount(article, amount) {
    data = {
        product_article: article,
        cart_id: cart_id,
        amount: amount
    }
    fetch('http://localhost:8080/api/cart/', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8080',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status === 200) {
                console.log("OK")
            }
        })
}

function updatePrice() {
    console.log(total)
    totalPrice.innerHTML = "Итого: " + total + " ₽"   
}

function constraintLength() {
    const inputs = document.querySelectorAll('input[type=number]');
    Array.from(inputs).forEach(input => {
        const min = +input.min;
        const max = +input.max;

        input.addEventListener('input', (e) => {
            const value = +input.value;
            if (value > max) { input.value = max }
            else if (value < min) { input.value = min }
        })
    });
}

function createOrder() {
    const amountInputs = document.querySelectorAll('.amount');
    const address = document.getElementById('address-selector')
    console.log(address)
    const address_id = address.options[address.selectedIndex].id
    console.log(address_id)
    purchase = [];
    for(let i = 0; i < amountInputs.length; i++) {
        purchase = purchase.concat({product_article: productArticles[i], amount: amountInputs[i].valueAsNumber})
    }
    data = {
        "purchase": purchase,
        "address": parseInt(address_id)
    }
    fetch('http://localhost:8080/api/order/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8080',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
            console.log(JSON.stringify(data))
            if (response.status == 200) {
                console.log("OK")
                removeAllFromCart();
            }
        })
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
                option.id = data.address[i].id
                option.textContent = option.value = "ул. " + data.address[i].street + ", дом " + data.address[i].house
                addressSelector.append(option)
            }
        })
}

function removeAllFromCart() {
    fetch('http://localhost:8080/api/cart/', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8080',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    })
        .then(response => {
            if (response.status == 200) {
                document.getElementById('container-cart').innerHTML = "";
            }
        })
}