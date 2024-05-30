const favorite = document.getElementById('container-favorite')

fetch('http://' + location.host + '/api/my/favorite/', {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.product == null) {
            favorite.innerHTML = "Избранное пусто"
        }
        else {
            for (let i = 0; i < data.product.length; i++) {
                placeElement(data.product[i])
            }
        }
    })

function placeElement(product) {
    const card = document.createElement('div');
    card.id = product.article;
    const image = document.createElement('img');
    const name = document.createElement('p');
    const price = document.createElement('p');
    const button = document.createElement('button');
    image.src = "../" + product.image;
    image.onerror = function () { this.src = "/images/empty.png" }
    name.innerHTML = product.name;
    price.innerHTML = product.price / 100 + " ₽";
    button.innerHTML = "Удалить";
    button.onclick = () => deleteFromFavorite(product.article);
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(button);
    favorite.appendChild(card);
}

function deleteFromFavorite(article) {
    data = {
        "product_article": article
    }
    fetch('http://' + location.host + '/api/my/favorite/', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            favorite.removeChild(document.getElementById(article))
            if (favorite.children.length === 0) {
                favorite.innerHTML = "Избранное пусто"
            }
        }
    })
}
