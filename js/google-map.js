function initMap() {
    var input1 = document.getElementById('address_field1');
    var input2 = document.getElementById('address_field2');
    var autocomplete1 = new google.maps.places.Autocomplete(input1);
    var autocomplete2 = new google.maps.places.Autocomplete(input2);

    google.maps.event.addListener(autocomplete1, 'place_changed', function () {
        var place = autocomplete1.getPlace();
        getCountryFromAddress(place)
    });

    google.maps.event.addListener(autocomplete2, 'place_changed', function () {
        var place = autocomplete2.getPlace();
        getCountryFromAddress(place)
    });
}

function getCountryFromAddress(place) {
    for (var i = 0; i < place.address_components.length; i += 1) {
        var addressObj = place.address_components[i];
        for (var j = 0; j < addressObj.types.length; j += 1) {
            if (addressObj.types[j] === 'country') {

                if (addressObj.types[j] == 'country') {
                    localStorage.setItem('country_long', addressObj.long_name)
                    localStorage.setItem('country_short', addressObj.short_name)
                }
            }
        }
    }
}