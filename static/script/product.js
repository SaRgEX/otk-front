function ToProduct(id) {
  localStorage.setItem('id', id);
  window.location.href = 'http://' + location.host + '/products/' + id; 
}

function loadProduct() {
  console.log(window.location.pathname)
}