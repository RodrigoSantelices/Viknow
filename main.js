/*
1. User will choose to search for tasting rooms or wineries within a certain radius
2. the user will be presented with a map, and the top options matching their query
3. The user can click the map, which will minimieze the top options
4. the user can click the options which will minimize the map
5. Upon clicking on an option on the map or the options screen the user will be taken
to a highlighted page for the option
*/
let STATE = {
  searchFor: '',
  distance: 500,
  nearMe: '',
  latitude:'' ,
  longitude:'',
  mapCenterLat:'',
  mapCenterLng:'',
  placeIds:[],
  locations:[
      {lat:38.3008793,lng:-122.4415462 }, //ravenswood
      {lat:38.299723,lng:-122.421981}, // Buena vista
      {lat:38.302088,lng:-122.424820}, // Bartholomew Park
      {lat:38.301072,lng:-122.403855}, // Favero Vineyards
      {lat:38.276088,lng:-122.414513} // Scribe Winery
]
}


const GOOGLE_MAPS_TEXT = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json';
const FOUR_SQUARE = 'https://api.foursquare.com/v2/venues/explore';
const GOOGLE_MAPS_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json'
// this function retrieves data from the google api for locations

//general error handling
$.ajaxSetup({
  error: function(xhr, status, error) {
  //  alert("An AJAX error occured: " + status + "\nError: " + error);
  $(`.js-error`).children('div').remove();
  $(`.js-error`).append(`<div><h2 class='errorMsg'>No Results Found</h2></div>`)
}});

// google places Text Search api request
function getDataFromGoogleText(locale, callback){
  const data = {
    query: STATE.searchFor+' in '+locale,
    key:'AIzaSyAw49baY4xcONFxgHFDIhGm8mcYjriK2CE',
    pagetoken:'' // make this work to display 20 more results
  }
  $.getJSON(GOOGLE_MAPS_TEXT, data, callback)
  console.log(locale)
};

// this function retrieves data from the foursquare api currently used to return the city that was searched
function getDataFromFourSquare(locale, callback){
  const data = {
    client_id: 'WAAZ1GSY5CM05ZRVSRUXC4JYMM4RRZ5KLOKOMCF4PRYI2XHZ',
    client_secret: 'P11LXVYDAKPIFOPYMUV1HXCVLAHCAFWP1K1WXLKWTP5ZYZM5',
    11: '',
    near: locale,
    //section: 'drinks', this is returning bars
    query: STATE.searchFor,
    v: '20170801', //not sure what this is
    limit:30
  }
  $.getJSON(FOUR_SQUARE, data, callback)
}

// this function renders our results into html
function renderResults(result){
  console.log(result);
  STATE.locations.length = 0;
  if (result.status ==='OK'){
  for (i=0; i<result.results.length;i++){
    const values = result.results[i];
    let request = {placeId: values.place_id};
  //  console.log(result.status);
        $(`.js-form`).children('fieldset').remove();
        $(`.js-where`).children('fieldset').remove();  //potential design to clear Where to Go and buttons form UI
        $(`.js-map`).removeClass('hidden');
        $(`.js-error`).children('div').remove();
        $(`.js-options`).append(`
          <div class='js-returned' data-lat ='${values.geometry.location.lat}' data-lng='${values.geometry.location.lng}' data-latlng = '{lat:${values.geometry.location.lat}, lng:'${values.geometry.location.lng}}'>
          <h3>${values.name}</h3>
          <p>Address:<br>${values.formatted_address}</p>` +
          (values.rating ? `<p>Rating:<br> ${values.rating} / 5</p>` : '<p>Not<br>Rated</p>') +
          `</div>`)
          // add to locations array

          $(`.js-form`).children('button').remove();
          $(`.js-form`).append(`<button type="submit" class="js-search-again" name="button">Search Again</button>`);
          STATE.locations.push({lat:values.geometry.location.lat, lng:values.geometry.location.lng});
          // add to place IDs array
          STATE.placeIds.push(request);
        }}
      else{
        console.log('error');
        $(`.js-error`).children('div').remove();
        $(`.js-error`).append(`<div><h2 class='errorMsg'>No Results Found</h2></div>`)
      }
        };

// this function goes through the returned objects from the google api
function displayGoogleTextData(data){
  //console.log(data);
 // passes values to other functions
 renderResults(data);
 initMap(data);

}
// this function goes through the returned objects of the foursquare api - currently only the city that was searched
function displayFourSquareData(data){
//console.log(data);
 $(`.whereSearched`).append(`<div class='row'><div class='col-6'><h2>${data.response.geocode.displayString}</h2></div><div class='col-6'><h3>Click and scroll through results for a closer look</h3></div></div>`)
}

// this function listens for the location submit
function watchSubmitLocation(){
  $(`.js-where`).submit(event =>{
    event.preventDefault();
    const locale = $('.js-otherLocation').val();
    if(locale){
    //clear input
    $('.js-otherLocation').val('');
    //clear previous results

    $(`.js-options`).children('div').remove();
    $(`.whereSearched`).children('div').remove();
    // these event listeners set the searchFor
    //move setSearchFor function in here -->
    getDataFromGoogleText(locale, displayGoogleTextData);
    getDataFromFourSquare(locale, displayFourSquareData);}

    else{
      $(`.js-error`).children('div').remove();
      $(`.js-error`).append(`<div><h2 class='errorMsg'>No Search Term Given</h2></div>`)
    }
})
}

//FUTURE FEATURE > Use my location, requires use of google places Nearby Search api
//function watchSubmitCurrent(){}

// this function sets the searchFor key value in STATE to either wineries or tasting room
function setSearchFor(){
  $(`.js-form`).on('click','.js-wineries',function(){
    $(`.js-wineries`).addClass('selected');
    $(`.js-tasteRooms`).removeClass('selected');
    STATE.searchFor = 'Wineries';
    console.log(STATE.searchFor);

  });
  $(`.js-form`).on('click','.js-tasteRooms',function(){
    $(`.js-tasteRooms`).addClass('selected');
    $(`.js-wineries`).removeClass('selected');
    STATE.searchFor = 'Tasting Room';
    console.log(STATE.searchFor);

  });

}

// event listener to search Again
function searchAgain(){
$(`.js-form`).on('click',`.js-search-again`, function(){
  $(`.js-form`).children('button').remove();
  $(`.js-map`).addClass('hidden')
  $(`.js-options`).children('div').remove();
  $(`.whereSearched`).children('div').remove();
  $(`.js-form`).append(
    `<fieldset>
      <h2>Where to Go</h2>
          <button type="button" name="button" class=" js-wineries js-search">Wineries</button>
          <button type="button" name="button" class="js-tasteRooms js-search ">Tasting Rooms</button>
    </fieldset>`
  )
});
}

//This function will call functions based on the users' selection and hides the original form
function whatToSearch(){
  $(`.js-form`).on('click','.js-search',function(){
    //will eventually ask to allow for location
    // make an if statement to set a global variable to winerie or taste room depending on which button was pressed.
  //  $(`.js-where`).removeClass('hidden');
  $(`.js-where`).children('fieldset').remove();
      $(`.js-where`).append(`
        <fieldset>
          <legend><h2 class='search-title'>Where to Search</h2></legend>
          <input type='text' class='js-otherLocation' aria-label='Search Bar' placeholder="ex. Sonoma, CA"/>
          <button type="submit" class="js-search-button" name="button">SEARCH</button>
        </fieldset>`)
    //CURR LOCATION FEATURE $(`.js-here`).removeClass('hidden')

  })
}
// This function updates the distance value not currently necessary
function updateTextInput(val) {
          document.getElementById('textInput').value=val;
          STATE.distance = val;
          console.log(STATE.distance);
        }

// map functionality, initiates map and displays returns on map also has access to returned values
function initMap(result){
/* currently buggy, removing letters for now
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;
*/
let map = new google.maps.Map(document.getElementById('map'), {
  zoom: 9,
  center: STATE.locations[0]
});

let options = [];
let getDeets = STATE.placeIds;
let newIcon = 'red-wine-bottle.svg';

// new marker for every returned location
let position = '';
for(i=0; i<STATE.locations.length; i++){
    options[i] = new google.maps.Marker({
    position: new google.maps.LatLng(STATE.locations[i]),
    animation:google.maps.Animation.DROP,
  //  label: labels[labelIndex++ % labels.length],
    map: map,
    icon:'icon.png'
  })
  //
    }

  //on click makrer zoom in
$(`.js-options`).on('click','.js-returned', function(){
      STATE.mapCenterLat = $(this).attr("data-lat");
      STATE.mapCenterLng = $(this).attr("data-lng");
      let latLng = new google.maps.LatLng(STATE.mapCenterLat, STATE.mapCenterLng)
        map.panTo(latLng);
        map.setZoom(18);
      //  center: STATE.mapCenter
        });


//sets zoom to include all markers
var bounds = new google.maps.LatLngBounds();
for (var i = 0; i < options.length; i++) {
 bounds.extend(options[i].getPosition());
}

map.fitBounds(bounds);

}

//function to bounce pins, yes you read that right
function toggleBounce() {
  if(marker.getAnimation() !== null){
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// bring it all together function
function searchWine(){
  setSearchFor();
  searchAgain();
  whatToSearch();
  watchSubmitLocation();
//  watchSubmitCurrent();
}

$(searchWine);
