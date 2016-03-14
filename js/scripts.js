var cardDeck = [];
var placeInDeck = 0;
var playerHand = [];
var dealerHand = [];
var playerBlackJack = false;
var dealerBlackJack = false;

$(document).ready(function() {

  createDeck();

  $('button').click(function() {
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

function resetGameBoard() {
  //Enable the Hit and Stand buttons
  $('#hit-button').prop('disabled', false);
  $('#stand-button').prop('disabled', false);
  var images = $('.card');
  for (i = 0; i < images.length; i++) {
    var key = images[i].id;
    $('#' + key).html('-');
    $('#' + key).addClass('empty');
  }
  $('.dealer-total').html('0');
  $('.player-total').html('0');
  $('#message').html('');
  playerBlackJack = false;
  dealerBlackJack = false;

}

function deal() {
  resetGameBoard();

  shuffleDeck();

  playerHand = [cardDeck[0], cardDeck[1]];
  dealerHand = [cardDeck[2], cardDeck[3]];

  placeInDeck = 4; //keep track of how many cards dealt

  placeCardOnBoard(playerHand[0], 'player', 'one');
  //placeCardOnBoard(dealerHand[0], 'dealer', 'one');

  placeCardOnBoard(playerHand[1], 'player', 'two');
  //placeCardOnBoard(dealerHand[1], 'dealer', 'two');

  calcHandTotal(playerHand, 'player');
  //calcHandTotal(dealerHand, 'dealer');

  checkBlackJack(playerHand);

}

function hit() {
  var slot = "";

  slot = nextSlot(playerHand.length);
  placeCardOnBoard(cardDeck[placeInDeck], 'player', slot);
  playerHand.push(cardDeck[placeInDeck]);
  placeInDeck++;
  total = calcHandTotal(playerHand, 'player');
  if (total.hardTotal > 21) {
    bust('player');
  }
}

function stand() {
  //now it's dealer's turn
  showDealerCards();

  var dealerBlackJack = checkBlackJack();
  
  calcHandTotal(dealerHand, 'dealer');
  $('#hit-button').prop('disabled', true);
  $('#stand-button').prop('disabled', true);
  var slot;
  dealerTotal = calcHandTotal(dealerHand, 'dealer');
  while (dealerTotal.hardTotal < 17 &&
    dealerTotal.softTotal < 17 &&
    dealerHand.length < 7) {

    slot = nextSlot(dealerHand.length);
    placeCardOnBoard(cardDeck[placeInDeck], 'dealer', slot);
    dealerHand.push(cardDeck[placeInDeck]);

    placeInDeck++;
    dealerTotal = calcHandTotal(dealerHand, 'dealer');

  }
  //we now know dealer has at least 17, check winner
  if (dealerTotal.hardTotal > 21) {
    bust('dealer');
  } else {
    checkWinner();
  }

}

function nextSlot(currentTotalCards) {
  var slot = "";
  if (currentTotalCards == 2) {
    slot = "three";
  } else if (currentTotalCards == 3) {
    slot = "four";
  } else if (currentTotalCards == 4) {
    slot = "five";
  } else if (currentTotalCards == 5) {
    slot = "six";
  } else {
    slot = "invalid";
  }

  return slot;
}


function greaterOf(v1, v2) {
  return v1 > v2 ? v1 : v2;
}


function checkWinner() {
  var playerHas = calcHandTotal(playerHand);
  var dealerHas = calcHandTotal(dealerHand);

  // if (dealerHas.hardTotal > 21) {
  //   $('#message').html("Dealer Bust");
  // } else 

  if (playerHas.hardTotal > greaterOf(dealerHas.hardTotal, dealerTotal.softTotal) ||
    playerHas.softTotal > greaterOf(dealerHas.hardTotal, dealerTotal.softTotal)) {
    $('#message').html("You beat the Dealer");
  } else if (playerHas.hardTotal < greaterOf(dealerHas.hardTotal, dealerTotal.softTotal) ||
    playerHas.softTotal < greaterOf(dealerHas.hardTotal, dealerTotal.softTotal)) {
    $('#message').html("The Dealer beat you");
  } else {
    $('#message').html("PUSH");
  }

}

function placeCardOnBoard(card, who, slot) {
  var currId = '#' + who + '-card-' + slot;
  var cardImage = '<img src="img/PNG-cards-1.3/' + card.file + '">';

  $(currId).removeClass('empty');
  $(currId).html(cardImage);
}

//todo:  call this when there is a blackjack or when player clicks Stand button
function showDealerCards() {
  placeCardOnBoard(dealerHand[0], 'dealer', 'one');
  placeCardOnBoard(dealerHand[1], 'dealer', 'two');
  calcHandTotal(dealerHand, 'dealer');
}

function messageBlackJack(who) {
  if (who == 'player') {
     $('#message').html("Player wins with Black Jack!");
   } else if (who == 'dealer') {
     $('#message').html("Dealer wins with Black Jack!");
   } else if (who == 'both') {
     $('#message').html("... PUSH ...");
   }
}
function checkBlackJack(hand) {
  var handTotal = calcHandTotal(hand);
  var gotBlackJack = false;
  if (handTotal.softTotal === 21) {
    gotBlackJack = true;
  }
  return gotBlackJack;

  // var player = calcHandTotal(playerHand);
  // var dealer = calcHandTotal(dealerHand);
  // var gotBlackJack = true;
  // if (player.softTotal === 21 && dealer.softTotal === 21) {
  //   $('#message').html("PUSH");
  // } else if (player.softTotal === 21) {
  //   $('#message').html("Player wins with Black Jack!");
  // } else if (dealer.softTotal === 21) {
  //   $('#message').html("Dealer wins with Black Jack!");
  // } else {
  //   gotBlackJack = false;
  // }

  // return gotBlackJack;

 // if (gotBlackJack) {
  //   $('#hit-button').prop('disabled', true);
  //   $('#stand-button').prop('disabled', true);
  //   showDealerCards();
 // }
}

function calcHandTotal(realHand, who) {
  var total = 0;
  var aceCnt = 0;
  var aceTotal = 0;
  for (i = 0; i < realHand.length; i++) {

    total += realHand[i].value;
    if (realHand[i].value === 1) { //it's an Ace
      aceCnt++;
    }
  }
  aceTotal = total;
  if (aceCnt > 0) {
    if (aceCnt > 1) {aceCnt = 1;}
    aceTotal = total + (10 * aceCnt);
  }

  var idToGet = '.' + who + '-total';
  //set dealer-total or player-total
  if (total === aceTotal) {
    $(idToGet).html(total);
  } else if (aceTotal > 21) { //Got two aces ..
    
  } else {
    $(idToGet).html(total + ' or ' + aceTotal);
  }

  // if (total > 21) {
  //   bust(who);
  // }

  return {
    "hardTotal": total,
    "softTotal": aceTotal
  };
}

function bust(who) {
  if (who === 'player') {
    $('#message').html("Player BUST!");
    $('#hit-button').prop('disabled', true);
    $('#stand-button').prop('disabled', true);
  } else {
    $('#message').html("Dealer BUST!");

  }
  
}

function createDeck() {

  for (s = 1; s <= 4; s++) {

    var realSuit = "";
    if (s === 1) {
      realSuit = "hearts";
    } else if (s === 2) {
      realSuit = "spades";
    } else if (s === 3) {
      realSuit = "diamonds";
    } else if (s === 4) {
      realSuit = "clubs";
    }

    var cardNum = 0;
    var cardVal = 0;

    for (i = 1; i <= 13; i++) {
      if (i === 1) {
        cardNum = "ace";
      } else if (i === 11) {
        cardNum = "jack";
      } else if (i === 12) {
        cardNum = "queen";
      } else if (i === 13) {
        cardNum = "king";
      } else {
        cardNum = i;
      }

      if (i < 11) {
        cardVal = i;
      } else {
        cardVal = 10;
      }
      var cardFile = cardNum + '_of_' + realSuit + ".png";
      cardDeck.push({
        // "card": i + suit,
        "value": cardVal,
        "file": cardFile
      });
    }
  }


}
// https://github.com/coolaj86/knuth-shuffle
function shuffleDeck() {
  var currentIndex = cardDeck.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = cardDeck[currentIndex];
    cardDeck[currentIndex] = cardDeck[randomIndex];
    cardDeck[randomIndex] = temporaryValue;

  }

  //return array;
}