function initSearch() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(continueSearch);
    }
}

var currentPlace = 0;

var currentImage = 0;

var placeArray = new Array();

var mainImage = document.getElementById("placePicture");

var placeTitle = document.getElementById("placeTitle");

function continueSearch(position) {
    var gpsCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var request = {
        location: gpsCoords,
        radius: '25',
        query: 'restaurant'
    }

    var service = new google.maps.places.PlacesService(document.createElement('div'));

    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place, iter) => {

                var detailsRequest = {
                    placeId: place.place_id,
                    fields: ['name', 'photos']
                }
                
                var placeDetails = new google.maps.places.PlacesService(document.createElement('div'));  

                var placePhotos = new Array();

                var placeName = place.name;
                
                placeDetails.getDetails(detailsRequest, (placeDetailed, statusDetailed) => {
                    if(statusDetailed === google.maps.places.PlacesServiceStatus.OK) {
                        console.log(placeDetailed.photos[0]);
                        placeDetailed.photos.forEach((photo, i) => {
                            if(i < 5) {
                                var photoUrl = photo.getUrl({maxWidth: 500, maxHeight: 500});
                                placePhotos.push(photoUrl);
                            }
                        });
                    }
                });
                
                placeArray.push({placeName, placePhotos});
            });
        }
    });
}

function updateImage() {
    mainImage.src = placeArray[currentPlace].placePhotos[currentImage];
    placeTitle.innerHTML = placeArray[currentPlace].placeName;
}

function leftImage() {
    currentImage = mod(currentImage - 1, 5);
    updateImage();
}

function rightImage() {
    currentImage = mod(currentImage - 1, 5);
    updateImage();
}

function dislike() {
    placeArray.shift();
    updateImage();
}

function like() {
    placeArray.shift();
    updateImage();
}

function mod(n, m) {
  return ((n % m) + m) % m;
}