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
  nearMe: ''
}

const FOUR_SQUARE = 'https://api.foursquare.com/v2/venues/explore';

// this function retrieves data from the foursquare api
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

// this function renders our results into html
function renderResults(result){
  console.log(result);
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
      `</div>`
        )

    /*


      </div>
      `) */
  }}}
// this function goes through the returned objects
function displayFourSquareData(data){
  console.log(data);
  $(`.whereSearched`).append(`<div class='search-place'>${data.response.geocode.displayString}</div>`)
  const results = data.response.groups.map((item, index) =>
renderResults(item));


}

// this function listens for the location submit FIXXX

function watchSubmit(){
  $(`.js-where`).submit(event =>{
    event.preventDefault();
    const locale = $('.js-otherLocation').val();
    //clear input
    $('.js-otherLocation').val('');

    // these event listeners set the searchFor
    //move setSearchFor function in here -->
    getDataFromFourSquare(locale, displayFourSquareData);
})
};

// this function sets the searchFor key value in STATE to either wineries or tasting room
function setSearchFor(){
  $(`.js-wineries`).on('click',function(){
    STATE.searchFor = 'Winery';
    console.log(STATE.searchFor);

  });
  $(`.js-tasteRooms`).on('click',function(){
    STATE.searchFor = 'Tasting Room';
    console.log(STATE.searchFor);
  });

}

//This function will call functions based on the users' selection and hides the original form
function whatToSearch(){
  $(`.js-search`).on('click',function(){
    //will eventually ask to allow for location
    // make an if statement to set a global variable to winerie or taste room depending on which button was pressed.
    $(`.js-where`).removeClass('hidden')

  })
}
// This function updates the distance value
function updateTextInput(val) {
          document.getElementById('textInput').value=val;
          STATE.distance = val;
          console.log(STATE.distance);
        }



//this function will grab the user's location and set 11 to those coordinates
function whereToSearch(){
  console.log('whereToSearch')
}
// bring it all together function
function searchWine(){
  setSearchFor();
  whatToSearch();
  watchSubmit();
}

$(searchWine);
