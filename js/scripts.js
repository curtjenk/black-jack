var theDeck = [];
var realDeck = [];
var placeInDeck = 0;

$(document).ready(function() {
  
  createDeck();

  $('button').click(function() {
    var clickedButton = $(this).attr('id');
    console.log(clickedButton);

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
   // console.log('begin deal');
   // console.log(theDeck);
   shuffleDeck();
   // console.log(theDeck);
   playerHand = [ theDeck[0], theDeck[1] ];
   dealerHand = [ theDeck[2], theDeck[3] ];

   realPlayerHand = [ realDeck[0], realDeck[1] ];
   realDealerHand = [ realDeck[2], realDeck[3] ];

   placeInDeck = 4; //keep track of how many cards dealt

   placeCard(playerHand[0], 'player', 'one');
   placeCard(dealerHand[0], 'dealer', 'one');

   placeCard(playerHand[1], 'player', 'two');
   placeCard(dealerHand[1], 'dealer', 'two');

   calculateTotal(playerHand, 'player');
   calculateTotal(dealerHand, 'dealer');

    placeRealCard(realPlayerHand[0], 'player', 'one');
   placeRealCard(dealerHand[0], 'dealer', 'one');

   placeRealCard(realPlayerHand[1], 'player', 'two');
   placeRealCard(realDealerHand[1], 'dealer', 'two');

}



function hit() {
 // placeCard()

}

function stand() {

}

function placeCard (card, who, slot) {
  // console.log("begin placeInDeck");
  var currId = '#' + who + '-card-' + slot;
  console.log(currId);
  $(currId).removeClass('empty');
  $(currId).html(card);
}

function placeRealCard(card, who, slot) {
  var currId = '#' + who + '-card-' + slot;
  console.log(card.file);
  var cardImage = '<img src="img/PNG-cards-1.3/' + card.file + '">';
  console.log(cardImage);
  $(currId).removeClass('empty');
  $(currId).html(cardImage);
}

function calculateTotal(hand, who)
{
  var total = 0;
  for (i=0; i<hand.length; i++) {
    var cardValue = Number(hand[i].slice(0, -1)); //returns hand[i] w/o the last char
    total += cardValue;
  }
  var idToGet = '.' + who + '-total';
  //set dealer-total or player-total
  $(idToGet).html(total);

  //todo:  check if total is over 21 (BUST!!)

}

function createDeck() {
  /* 
    h, s, d, c

  */
  for (s = 1; s <= 4; s++) {
    var suit = "";
    var realSuit ="";
    if (s === 1) {
      suit = "h"; realSuit="hearts";
    } else if (s === 2) {
      suit = "s"; realSuit="spades";
    } else if (s === 3) {
      suit = "d"; realSuit="diamonds";
    } else if (s === 4) {
      suit = "c"; realSuit="clubs2";
    }

    for (i=1; i<=13; i++) {
      theDeck.push(i+suit);
      
      var cardNum = i;
      if (i === 1) {
        cardNum = "ace";
      } else if (i === 11) {
        cardNum = "jack";
      } else if (i === 12) {
        cardNum = "queen";
      } else if (i === 13) {
        cardNum = "king";
      } 
      var cardFile = cardNum + '_of_' + realSuit + ".png";
      realDeck.push({"card":i+suit, "file":cardFile});
    }
  }

}
// https://github.com/coolaj86/knuth-shuffle
function shuffleDeck() {
  var currentIndex = theDeck.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = theDeck[currentIndex];
    theDeck[currentIndex] = theDeck[randomIndex];
    theDeck[randomIndex] = temporaryValue;

    temporaryValue = realDeck[currentIndex];
    realDeck[currentIndex] = realDeck[randomIndex];
    realDeck[randomIndex] = temporaryValue;

  }

  //return array;
}