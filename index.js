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
  distance: 5,
}
//This function will call functions based on the users' selection and hides the original form
function whatToSearch(){
  $('.js-search').on('click',function(){
    //will eventually ask to allow for location
    // make an if statement to set a global variable to winerie or taste room depending on which button was pressed.

    $('.js-form').hide();
    $('.js-where').append(`
    <button class='js-nearMe'>Use My Current Location</button>
    <label>Other Location</label>
    <input type='search' class='js-otherLocation'>
    <label>Distance (mi)</label>
    <input  type="range" name="points" min="1" max="100" step:'25' list='tickmarks' class="rangeBar" onchange="updateTextInput(this.value);">
    <datalist id='tickmarks'>
          <option value="1" label="1%">
          <option value="25" label=25>
          <option value="50" label=50>
          <option value="75" label=75>
          <option value="100" label=100>
        </datalist>
        <input type="text" id="textInput" value="50" disabled>`)
  })
}
// This function updates the distance value
function updateTextInput(val) {
          document.getElementById('textInput').value=val;
          STATE.distance = val;
          console.log(STATE.distance);
        }

// this function sets the searchFor key value in STATE to either wineries or tasting room
function setSearchFor(){
  $('.js-wineries').on('click',function(){
    STATE.searchFor = 'wineries'
    console.log(STATE.searchFor);
  });
  $('.js-tasteRooms').on('click',function(){
    STATE.searchFor = 'tasting room';
    console.log(STATE.searchFor);
  });

}

//this function will determine the information that will be sent to the APIs, location, and distance.
function whereToSearch(){

}

// bring it all together function
function searchWine(){
  whatToSearch();
  setSearchFor();
}

searchWine();
