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
      {lat:38.294788,lng:-122.461510 } //sonoma county, to be replaced

]
}

const FOUR_SQUARE = 'https://api.foursquare.com/v2/venues/explore';

// this function retrieves data from the foursquare api. Locale = set destination
function getDataFromFourSquare(locale, callback){
  const data = {
    client_id: 'WAAZ1GSY5CM05ZRVSRUXC4JYMM4RRZ5KLOKOMCF4PRYI2XHZ',
    client_secret: 'P11LXVYDAKPIFOPYMUV1HXCVLAHCAFWP1K1WXLKWTP5ZYZM5',
    11: '',
    near: locale,
    //section: 'drinks', this is returning bars
    query: STATE.searchFor,
    v: '20170801', //not sure what this is
    limit:10
  }
  $.getJSON(FOUR_SQUARE, data, callback)
  console.log(locale)
};

//will be called instead of the other getData function and return current location instead
function getDataFromFourSquareCurrent(locale, callback){
  const data = {
    client_id: 'WAAZ1GSY5CM05ZRVSRUXC4JYMM4RRZ5KLOKOMCF4PRYI2XHZ',
    client_secret: 'P11LXVYDAKPIFOPYMUV1HXCVLAHCAFWP1K1WXLKWTP5ZYZM5',
    11: locale,
    near: '',
    //section: 'drinks', this is returning bars
    query: STATE.searchFor,
    v: '20170801', //not sure what this is
    limit:10
  }
  $.getJSON(FOUR_SQUARE, data, callback)
  console.log(locale)
};

// this function renders our results into html
function renderResults(result){
  console.log(result);
  STATE.locations.length = 0;
  for (i=0; i<result.items.length;i++){
    const values = result.items[i].venue;
    if (values.location.address){
    $(`.js-options`).append(`
      <div class='js-returned'>
      <h3>${values.name}</h3>`+
      (values.contact.formattedPhone ? `<p>Contact:${values.contact.formattedPhone}</p>`: ``) +
      `<p>Address:${values.location.address}</p>` +
      (values.rating ? `<p>Rating:${values.rating}</p>` : '') +
      (values.url ? `<button class='site-button'><a href='${values.url}' target='_blank'>More Info</a></button>` : '') +
      `</div>`)
      // add to locations array
      STATE.locations.push({lat:values.location.lat, lng: values.location.lng});
      console.log(STATE.locations)
        }
      }}
// this function goes through the returned objects
function displayFourSquareData(data){
  console.log(data);
/* don't hide?
  $(`.js-where`).addClass('hidden');
  $(`.js-here`).addClass('hidden'); */
  $(`.whereSearched`).append(`<div class='search-place'>${data.response.geocode.displayString}</div>`)
  const results = data.response.groups.map((item, index) =>
renderResults(item));
const resultsMap = data.response.groups.map((item, index) =>
initMap(item));

}

// this function listens for the location submit FIXXX

function watchSubmitLocation(){
  $(`.js-where`).submit(event =>{
    event.preventDefault();
    const locale = $('.js-otherLocation').val();
    //clear input
    $('.js-otherLocation').val('');
    //clear previous results
    //removes previous search results
    $(`.js-options`).children('div').remove();
    $(`.whereSearched`).children('div').remove();
    // these event listeners set the searchFor
    //move setSearchFor function in here -->
    getDataFromFourSquare(locale, displayFourSquareData);
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
    STATE.searchFor = 'Winery';
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
for(i=0; i<STATE.locations.length; i++){
    options[i] = new google.maps.Marker({
    position: new google.maps.LatLng(STATE.locations[i]),
    map: map
  });
}
//let sonoma = STATE.locations[0];
//let nappa = {lat:38.297539, lng:-122.286865};


}

// bring it all together function
function searchWine(){
  setSearchFor();
  whatToSearch();
  watchSubmitLocation();
//  watchSubmitCurrent();
}

$(searchWine);
