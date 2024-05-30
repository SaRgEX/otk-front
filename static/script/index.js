fetch('http://' + location.host + '/api/products/')
.then(response => response.json())
.then(data => {
  const container = document.getElementById('data-container');
  for (let i = 0; i < data["data"].length; i++) {
    const containerProduct = document.createElement('div');
    containerProduct.className = "product-data";
    const productInfo = document.createElement('div');
    productInfo.className = "product-info";
    const image = document.createElement('img');
    const name = document.createElement('p');
    const description = document.createElement('p');
    const price = document.createElement('p');
    name.innerHTML = data["data"][i]["name"];
    description.innerHTML = data["data"][i]["description"];
    price.innerHTML = data["data"][i]["price"] / 100 + " ₽";
    image.src = data["data"][i]["image"];
    image.onerror = function () { this.src = "/images/empty.png" }
    image.width = 250;
    image.height = 250;
    containerProduct.appendChild(image);
    productInfo.appendChild(name);
    productInfo.appendChild(price);
    containerProduct.appendChild(productInfo);
    containerProduct.onclick = function () { ToProduct(data["data"][i]["article"]) }
    container.appendChild(containerProduct);
  }
})
.catch(error => console.log(error));