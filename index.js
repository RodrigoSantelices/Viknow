/*
1. User will choose to search for tasting rooms or wineries within a certain radius
2. the user will be presented with a map, and the top options matching their query
3. The user can click the map, which will minimieze the top options
4. the user can click the options which will minimize the map
5. Upon clicking on an option on the map or the options screen the user will be taken
to a highlighted page for the option
*/
let STATE = {
  searchFor: 'test',
  distance: 5,
  nearMe: ''
}

const FOUR_SQUARE = 'https://api.foursquare.com/v2/venues/search';

// this function retrieves data from the foursquare api
function getDataFromFourSquare(callback){
  const query = {
    client_id: 'WAAZ1GSY5CM05ZRVSRUXC4JYMM4RRZ5KLOKOMCF4PRYI2XHZ',
    client_secret: 'P11LXVYDAKPIFOPYMUV1HXCVLAHCAFWP1K1WXLKWTP5ZYZM5',
    11: '',
    near: '',
    radius: STATE.distance,
    query: STATE.searchFor,
    v: '20170801',
    limit:20
  }
  $.getJSON(FOUR_SQUARE, query, callback)
  console.log(query)
};

// this function renders our results into html
function renderResults(result){
  console.log(result);
  return
  `<h2>${result.name}<h2>`
}

// this function goes through the returned objects
function displayFoursquareData(data){
  const results = data.items.map((item,index) =>
renderResults(items));
$(`.js-options`).html(results);
}

// this function listens for the location submit FIXXX

function watchSubmit(){
  $(`.js-where`).submit(event =>{
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(`.js-otherLocation`)
    const query = query.target.val();

    //clear input
    queryTarget.val('');
    getDataFromFourSquare(query, displayFoursquareData);
})
};

// this function sets the searchFor key value in STATE to either wineries or tasting room
function setSearchFor(){
  $(`.js-wineries`).on('click',function(){
    STATE.searchFor = 'Wineries';
    console.log(STATE.searchFor);

  });
  $(`.js-tasteRooms`).on('click',function(){
    STATE.searchFor = 'Tasting Rooms';
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



//this function will determine the information that will be sent to the APIs, location, and distance.
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
