var marker;
var places;
var autocomplete;
var beginSearch = document.getElementById('userSearch');


//API key for SeatGeek
var id = 'MzI4Mzc0M3wxNTU1NTUzMjg4LjU3';

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 32.7838, lng: -96.7832 },
    mapTypeControl: false,
    panControl: false,
    zoomControl: true,
    streetViewControl: false
  });

  autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(
      document.getElementById('userInput')), {
      types: ['(cities)']
    });
  places = new google.maps.places.PlacesService(map);

  beginSearch.addEventListener('click', onPlaceChanged);

}


function onPlaceChanged(e) {
  e.preventDefault();
  var place = autocomplete.getPlace();
  console.log(place);
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(14);
    placeMarkers();
    allResults();
  } else {
    document.getElementById('userInput').placeholder = 'Enter a city';
  }
}

function placeMarkers() {
  var place = autocomplete.getPlace();
  var userCity = place.address_components[0].short_name;
  //calling ajax function
  var queryURL = 'https://api.seatgeek.com/2/events?client_id=' + id + '&venue.city=' + userCity;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(queryURL);
    console.log(response);
    console.log(response.events[0].venue.location.lat);
    console.log(response.events[0].venue.location.lon);

    //loop for setting markers
    for (var i = 0; i < response.events.length; i++) {
      var dateFormatted = moment(response.events[i].datetime_local).format('MMMM Do YYYY, h:mm:ss a');
      var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3 id="firstHeading" class="firstHeading">' + response.events[i].title + '</h3>' +
        '<div id="bodyContent">' +
        '<p>Date: ' + dateFormatted + '</p>' +
        '<p>Average Price: $' + response.events[i].stats.average_price + '</p>' +
        '<p>Location: ' + response.events[i].venue.address +
        ' ' + response.events[i].venue.extended_address + '</p>' +
        '<p><a href="' + response.events[i].url + '">Buy your tickets now!</a>' +
        '</p>' +
        '</div>' +
        '</div>';

      var marker = response.events[i];
      var content = contentString;
      var infowindow = new google.maps.InfoWindow();


      marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: { lat: response.events[i].venue.location.lat, lng: response.events[i].venue.location.lon }
      });

      google.maps.event.addListener(marker, 'click', function (content) {
        return function () {
          infowindow.close();
          infowindow.setContent(content);
          infowindow.open(map, this);
        }
      }(content));

    }
  });
}

document.getElementById("btnOne").addEventListener("click", buttonResult);

function allResults() {

  var place = autocomplete.getPlace();
  var userCity = place.address_components[0].short_name;

  var queryURL = 'https://api.seatgeek.com/2/events?client_id=' + id + '&venue.city=' + userCity;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    $(".row").empty();
    for (var x = 0; x < response.events.length; x++) {
      var dateFormatted = moment(response.events[x].datetime_local).format('MMMM Do YYYY, h:mm:ss a');

      var newCard = document.createElement("div");
      newCard.className = "card mr-2 ml-2 mt-2";
      newCard.style.width = "18em";
      var newImage = document.createElement("img");
      newImage.src = response.events[x].performers[0].image;
      newCard.append(newImage);
      var newBody = document.createElement("div");
      newBody.className = "card-body";
      newCard.append(newBody);
      var newTitle = document.createElement("h5");
      newTitle.className = "card-title";
      newTitle.innerHTML = response.events[x].title;
      newCard.append(newTitle)
      var newText = document.createElement("p");
      newText.className = "card-text";
      newText.innerHTML = "<b>Date: </b>"+ dateFormatted;
      newCard.append(newText);
      var newLocation = document.createElement("p");
      newLocation.className = "card-text";
      newLocation.innerHTML = "<b>Location: </b>" + response.events[x].venue.address + " " + response.events[x].venue.extended_address;
      newCard.append(newLocation);
      var newBut = document.createElement("a");
      newBut.setAttribute("href", response.events[x].url);
      newBut.className = "btn btn-primary";
      newBut.style.color = "white";
      newBut.innerHTML = "Buy your tickets now!";
      newCard.append(newBut);
      $(".row").append(newCard);
    }
  })
}

function buttonResult() {
  console.log($(this).val());
  var queryURL = 'https://api.seatgeek.com/2/events?client_id=' + id + '&venue.city=Dallas&';

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response)

    for (var x = 0; x < response.events.length; x++) {
      var newCard = document.createElement("div");
      newCard.className = "card mr-2 ml-2 mt-2";
      newCard.style.width = "18em";
      var newImage = document.createElement("img");
      newImage.src = response.events[x].performers[0].image;
      newCard.append(newImage);
      var newBody = document.createElement("div");
      newBody.className = "card-body";
      newCard.append(newBody);
      var newTitle = document.createElement("h5");
      newTitle.className = "card-title";
      newTitle.innerHTML = response.events[x].title;
      newCard.append(newTitle)
      var newText = document.createElement("p");
      newText.className = "card-text";
      newText.innerHTML = "Location: " + response.events[x].venue.address + " " + response.events[x].venue.extended_address;
      newCard.append(newText);
      var newBut = document.createElement("a");
      newBut.setAttribute("href", response.events[x].url);
      newBut.className = "btn btn-primary";
      newBut.style.color = "white";
      newBut.innerHTML = "Buy your tickets now!";
      newCard.append(newBut);
      $(".row").append(newCard);
    }
  })
}


//firebase 
var config = {
  apiKey: "AIzaSyBqZpUSOdM-bmk9ys3c1tzeBiSIRUPMB9w",
  authDomain: "eventmaps-c518c.firebaseapp.com",
  databaseURL: "https://eventmaps-c518c.firebaseio.com",
  projectId: "eventmaps-c518c",
  storageBucket: "eventmaps-c518c.appspot.com",
  messagingSenderId: "390935301732"
};

firebase.initializeApp(config);

$("#newRegister").on('click', hideModal);

function hideModal() {
  $("#loginModal").modal('hide');
  $("#registerModal").modal('show');
}
