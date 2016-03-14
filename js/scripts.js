var theDeck = [];

$(document).ready(function() {
  $('button').click(function() {
    alert($(this).attr('id'));
    var clickedButton = $(this).attr('id');
    if (clickedButton == 'deal-button') {
      deal();
    } else if (clickedButton == 'hit-button') {
      hit();
    } else if (clickedButton == 'stand-button') {
      stand();
    }

  });
});

function deal() {
  theDeck = shuffleDeck();
}

function hit() {


}

function stand() {

}

function shuffleDeck() {
  /* 
    h, s, d, c

  */
  for (var s = 1; s <= 4; s++) {
    var suit = "";
    if (s === 1) {
      suit = "h";
    } else if (s === 2) {
      suit = "s";
    } else if (s === 3) {
      suit = "d";
    } else if (s === 4) {
      suit = "c";
    }
    for (var i=1; i<=13; i++) {
      theDeck.push(i+suit);
    }
  }
  console.log(theDeck);
  console.log(shuffle(theDeck));

}
// https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}