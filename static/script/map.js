const addressInputs = document.querySelectorAll('.address-form__input');

const center = [55.441006, 65.341113];
function init() {
    let map = new ymaps.Map('address-map', {
        center: center,
        zoom: 13
    });

    let placemark = new ymaps.Placemark(center, {
        balloonContentHeader: 'Офис',
        balloonContentBody: 'ул. Машиностроителей, д. 30/2',
        balloonContentFooter: 'г. Курган',
    }, {
        iconLayout: 'default#image',
        iconImageHref: '/images/marker_map.png',
        iconImageSize: [50, 50],
        iconImageOffset: [-20, 20]
    });
 
    let placemark1 = new ymaps.Placemark(center, {
    }, {
        iconLayout: 'default#image',
        iconImageHref: '/images/marker_map.png',
        iconImageSize: [50, 50],
        iconImageOffset: [0, 0]
    });
    var current_state = map.action.getCurrentState();
    var geoCenter = map.options.get('projection').fromGlobalPixels(current_state.globalPixelCenter, current_state.zoom);
    map.events.add('actiontick', function (e) {
        current_state = map.action.getCurrentState();
        geoCenter = map.options.get('projection').fromGlobalPixels(current_state.globalPixelCenter, current_state.zoom);    
        placemark.geometry.setCoordinates(geoCenter);        
    });
    map.events.add('mouseup', function (e) {
        ymaps.geocode(geoCenter).then(function (res) {
            var nearest = res.geoObjects.get(0);
            var address = nearest.getAddressLine();
            var name = nearest.properties.get('name');            
            parts = name.split(',');
            addressInputs[1].value = parts[0];
            addressInputs[2].value = parts[1];
        });
    });

    let geolocation = ymaps.geolocation;
    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        let a = result.geoObjects.get(0).properties._data
        addressInputs[0].value = a.text.split(',')[0]
        addr = a.name.split(',')
        addressInputs[1].value = addr[0]
        addressInputs[2].value = addr[1]
    });

    map.controls.remove('geolocationControl') // удаляем геолокацию
    map.controls.remove('searchControl') // удаляем поиск
    map.controls.remove('typeSelector') // удаляем тип
    map.controls.remove('fullscreenControl') // удаляем кнопку полного экрана
    map.controls.remove('zoomControl') // удаляем контрол зуммирования
    map.controls.remove('trafficControl') // удаляем контрол трафика
    map.controls.remove('rulerControl') // удаляем контрол правил
    map.geoObjects.add(placemark)
}

ymaps.ready(init)