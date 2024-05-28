

const token = localStorage.getItem('token');


export async function setAuthorizationHeader() {
    // Установка заголовка
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    // Возврат заголовков как результат промиса
    return headers;

}

document.getElementById('order').addEventListener('click', function() {
  // Вызов функции setAuthorizationHeader и выполнение запроса на сервер
  setAuthorizationHeader()
    .then(headers => {
      // Выполнение запроса на сервер с установленным заголовком
      return fetch('/api/order', { headers });
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Обработка ответа от сервера
    })
    .catch(error => {
      // Обработка ошибок
    });
});

window.location.href = 'http://localhost:8080/api/order';