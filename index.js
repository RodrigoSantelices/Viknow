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
  locations:[
      {lat:38.300851,lng:-122.441418 } //sonoma county, to be replaced

]
}

const GOOGLE_MAPS_TEXT = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json';

// this function retrieves data from the foursquare api. Locale = set destination
function getDataFromGoogleText(locale, callback){
  const data = {
    query: STATE.searchFor+' in '+'redmond',
    key:'AIzaSyDjWatYqtllES1av6Nt2vC-r0JtP6uoEwg',
  }
  $.getJSON(GOOGLE_MAPS_TEXT, data, callback)
  console.log(locale)
};

// this function renders our results into html
function renderResults(result){
  console.log(result);
  STATE.locations.length = 0;
  for (i=0; i<result.results.length;i++){
    const values = result.results[i];
    if (values.formatted_address){
    $(`.js-options`).append(`
      <div class='js-returned' data-venue ='${values.name}'>
      <h3>${values.name}</h3>`+
      (values.contact.formattedPhone ? `<p>Contact:${values.contact.formattedPhone}</p>`: `<p>No Contact Provided</p>`) +
      `<p>Address:${values.location.address}</p>` +
      (values.rating ? `<p>Rating:${values.rating}</p>` : '<p>Not Rated</p>') +
      (values.url ? `<button class='site-button'><a href='${values.url}' target='_blank'>More Info</a></button>` : `<button class='site-button'>No More Info</button>`) +
      `</div>`)
      // add to locations array
      STATE.locations.push({lat:values.location.lat, lng: values.location.lng});
        }
      }}
// this function goes through the returned objects
function displayGoogleTextData(data){
  console.log(data);
 $(`.whereSearched`).append(`<div class='search-place'></div>`)
 /*const results = data.response.groups.map((item, index) =>
 renderResults(item));
 const resultsMap = data.response.groups.map((item, index) =>
 initMap(item));
*/
}

$(`.js-options`).on('click','.js-returned', function(){
  $(this).attr("data-venue")
  console.log($(this).attr("data-venue") )
})
// this function listens for the location submit FIXXX

function watchSubmitLocation(){
  $(`.js-where`).submit(event =>{
    event.preventDefault();
    const locale = $('.js-otherLocation').val();
    //clear input
    $('.js-otherLocation').val('');
    //clear previous results

    $(`.js-options`).children('div').remove();
    $(`.whereSearched`).children('div').remove();
    // these event listeners set the searchFor
    //move setSearchFor function in here -->
    getDataFromGoogleText(locale, displayGoogleTextData);
})
}

//my location not working currently
function watchSubmitCurrent(){

}

// this function sets the searchFor key value in STATE to either wineries or tasting room
function setSearchFor(){
  $(`.js-wineries`).on('click',function(){
    $(`.js-wineries`).addClass('selected');
    $(`.js-tasteRooms`).removeClass('selected');
    STATE.searchFor = 'Wineries';
    console.log(STATE.searchFor);

  });
  $(`.js-tasteRooms`).on('click',function(){
    $(`.js-tasteRooms`).addClass('selected');
    $(`.js-wineries`).removeClass('selected');
    STATE.searchFor = 'Tasting Room';
    console.log(STATE.searchFor);

  });

}

//This function will call functions based on the users' selection and hides the original form
function whatToSearch(){
  $(`.js-search`).on('click',function(){
    //will eventually ask to allow for location
    // make an if statement to set a global variable to winerie or taste room depending on which button was pressed.
    $(`.js-where`).removeClass('hidden');
    $(`.js-here`).removeClass('hidden')

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
//test sonoma
  //let sonoma = {lat:result.items[0].venue.location.lat, lng: result.items[0].venue.location.lng};
//actual sonoma
let map = new google.maps.Map(document.getElementById('map'), {
  zoom: 12,
  center: STATE.locations[0]
});
let options = [];


let newIcon = 'red-wine-bottle.svg'
// new marker for every returned location
for(i=0; i<STATE.locations.length; i++){
    options[i] = new google.maps.Marker({
    position: new google.maps.LatLng(STATE.locations[i]),
    animation:google.maps.Animation.DROP,
    map: map,
  //  icon: newIcon
  });
}
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
  whatToSearch();
  watchSubmitLocation();
//  watchSubmitCurrent();
}

$(searchWine);
