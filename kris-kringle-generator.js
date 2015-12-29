jQuery(document).ready(function () {

  "use strict"; //jshint

  /*------------------------------------------- THE GENERATOR ----------------------------------------*/

  // Global Generator variable
  window.Generator = (function () {

    var success = true;
    var participants;
    var participantsTemp;
    var matchArray;

    /*
    Starts the Generator
    */
    function start(array) {
      participants = array;
      setup();
    }

    /*
    Sets up defaults
    */
    function setup() {
      participants.sort(function () {
        return 0.5 - Math.random();
      }); // Shuffle Array order
      participantsTemp = [];
      matchArray = [];
      findPossibilities();
    }

    /*
    Loops through participants array
    */
    function findPossibilities() {
      ``
      $(participants).each(function () {
        addPossibility(this);
      });
      findExclusionWeighting();
    }

    /*
    Generates array of possibilities for each participants
    */
    function addPossibility(itemToAddPossibility) {
      $(participants).each(function () {
        if (this.id !== itemToAddPossibility.id) {
          if ($.inArray(this.id, itemToAddPossibility.exclusions) === -1) {
            itemToAddPossibility.possibilities.push(this.id);
          }
        }
      });
    }

    /*
    Gives each participant a weighting based on how many times they are excluded
    */
    function findExclusionWeighting() {
      $(participants).each(function () {
        $(this.exclusions).each(function (index, value) {
          var arrayIndex = getIndex(value);
          participants[arrayIndex].weighting++;
        });
      });
      participants.sort(sortParticipants); // Sort Array first
      participantsTemp = participants.slice(); // Creates new instance of array to work with
      findMatches();
    }

    /*
    Removes a selected participant from every possibility array
    */
    function removePossibility(possibility) {
      $(participantsTemp).each(function () {
        if ($.inArray(possibility, this.possibilities) !== -1) {
          var item = $.inArray(possibility, this.possibilities);
          this.possibilities.splice(item, 1); // Remove matched possibility
        }
      });
    }

    /*
    Creates matches for each participant based on available possibilities
    */
    function findMatches() {
      var length = participantsTemp.length;

      for (var i = 0; i < length; i++) {
        if (participantsTemp[0].possibilities.length > 0) {

          // Sort weightings
          participantsTemp[0].possibilities.sort(sortWeightings);

          var item = 0;
          var id = participantsTemp[0].possibilities[item];

          matchArray.push({
            name: participantsTemp[0].name,
            match: getParticipantsName(id)
          });
          removePossibility(participantsTemp[0].possibilities[item]);
        } else {
          success = false;
          console.log('No possibilities: ' + participantsTemp[0].name);
          console.log('Abort');
        }

        participantsTemp.splice(0, 1); // Remove current matched object from array
        participantsTemp.sort(sortParticipants); // Re-sort possibilities

      }

      if (success === true) {
        printResult();
      }

    }

    /*------------------------------------------- HELPER METHODS ----------------------------------------*/

    /*
    Returns the array index of a participant based on the id
    */
    function getIndex(id) {
      var arrayIndex;
      $(participants).each(function (index) {
        if (this.id === id) {
          arrayIndex = index;
        }
      });
      return arrayIndex;
    }

    /*
    Returns the name (String) of a participant based on the id
    */
    function getParticipantsName(id) {
      var name;
      $(participants).each(function () {
        if (this.id === id) {
          name = this.name;
        }
      });
      return name;
    }

    /*
    Sorts array in order of participant with most exclusions first
    */
    function sortParticipants(a, b) {
      return a.possibilities.length - b.possibilities.length;
    }

    /*
    Sorts possibilities by weighting
    This will ensure the possibilit with the highest exclusion rate will be used
    */
    function sortWeightings(a, b) {
      return b.weighting - a.weighting;
    }

    /*
    Logs a list of results
    */
    function printResult() {
      $(matchArray).each(function () {
        console.log(this.name + ' is giving a present to ' + this.match);
      });
      console.log('--------------------------------------------');
    }

    return {
      start: start
    };

  }());

});
