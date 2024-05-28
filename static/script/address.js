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