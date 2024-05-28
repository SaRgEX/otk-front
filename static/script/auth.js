const getOrder = async (token) => {
  try {
     const response = await fetch('/api/order', {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     })      
     console.log(response);
  } catch (error) {
     // Обработайте ошибку
     console.error('Error fetching order:', error);
  }
 };
 
 getOrder(localStorage.getItem('token'));