function ToProduct(id) {
  localStorage.setItem('id', id);
  window.location.href = 'http://localhost/products/' + id; 
}

function loadProduct() {
  console.log(window.location.pathname)
}