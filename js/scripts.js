var cardDeck = [];
var placeInDeck = 0;
var playerHand = [];
var dealerHand = [];
var playerBlackJack = false;
var dealerBlackJack = false;

var playerWinCount = 0;
var dealerWinCount = 0;

var testBlackJackCards = [{
  "value": 10,
  "file": "10_of_clubs.png"
}, {
  "value": 1,
  "file": "ace_of_clubs.png"
}];
var testAceCard = {
  "value": 1,
  "file": "ace_of_clubs.png"
};


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
  //--testing for Black Jack on the deal
  //playerHand = [testBlackJackCards[0], testBlackJackCards[1]];
  //---------------

  playerHand = [cardDeck[0], cardDeck[1]];

  //--testing for Black Jack on the deal
  //dealerHand = [testBlackJackCards[0], testBlackJackCards[1]];
  //--------------

  dealerHand = [cardDeck[2], cardDeck[3]];

  placeInDeck = 4; //keep track of how many cards dealt

  placeCardOnBoard(playerHand[0], 'player', 'one', 500);
  placeCardOnBoard(playerHand[1], 'player', 'two', 1100);

  setTimeout(function() {
    calcHandTotal(playerHand, 'player');

    var blackJack = checkBlackJack(playerHand);
    if (blackJack) {
      showDealerCards();
      blackjack = checkBlackJack(dealerHand);
      if (blackjack) { //call messageWinner with Who and Why
        messageWinner('push', 'blackjack');
      } else {
        messageWinner('player', 'blackjack');
      }
      gameOver();
    }
  }, 1600);

}

function hit() {

  var slot = "";
  slot = nextSlot(playerHand.length);
  placeCardOnBoard(cardDeck[placeInDeck], 'player', slot, 500);
  //playerHand.push(testAceCard); //testing ... testing... testing
  playerHand.push(cardDeck[placeInDeck]);
  placeInDeck++;

  setTimeout(function() {
    total = calcHandTotal(playerHand, 'player');
    if (total.hardTotal > 21) {
      // bust('player');
      messageWinner('player', 'bust');
      gameOver();
    }
  }, 700);

}

function stand() {
  //now it's dealer's turn
  showDealerCards();

  setTimeout(function() {
    var blackJack = checkBlackJack(dealerHand);
    if (blackJack) {
      messageWinner('dealer', 'blackjack');
      gameOver();
      return;
    }
  }, 1500);

  setTimeout(function() {
    var slot;
    dealerTotal = calcHandTotal(dealerHand, 'dealer');
    while (dealerTotal.hardTotal < 17 &&
      dealerTotal.softTotal < 17 &&
      dealerHand.length < 7) {

      slot = nextSlot(dealerHand.length);
      placeCardOnBoard(cardDeck[placeInDeck], 'dealer', slot, 0);
      dealerHand.push(cardDeck[placeInDeck]);

      placeInDeck++;

      dealerTotal = calcHandTotal(dealerHand, 'dealer');

    }
    //we now know dealer has at least 17, check winner
    if (dealerTotal.hardTotal > 21) {
      messageWinner('dealer', 'bust');
      // bust('dealer');
    } else {
      var winner = checkWinner();
      messageWinner(winner, 'straight');
    }

    gameOver();
  }, 1600);
}

// function dummyDelay() {
//   setTimeout(function ()
// }

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
  var winner = '';

  var playerTotal = greaterOf(playerHas.hardTotal, playerHas.softTotal);
  var dealerTotal = greaterOf(dealerHas.hardTotal, dealerHas.softTotal);

  if (playerTotal > dealerTotal) {
    winner = 'player';
  } else if (playerTotal < dealerTotal) {
    winner = 'dealer';
    //$('#message').html("The Dealer beat you");
  } else {
    winner = 'push';
    // $('#message').html("PUSH");
  }
  return winner;
}

function placeCardOnBoard(card, who, slot, delay) {
  setTimeout(function() {
    var currId = '#' + who + '-card-' + slot;
    var cardImage = '<img src="img/PNG-cards-1.3/' + card.file + '">';

    $(currId).removeClass('empty');
    $(currId).html(cardImage);
  }, delay);

}

//todo:  call this when there is a blackjack or when player clicks Stand button
function showDealerCards() {
  placeCardOnBoard(dealerHand[0], 'dealer', 'one', 400);
  placeCardOnBoard(dealerHand[1], 'dealer', 'two', 900);
  setTimeout(function() {
    calcHandTotal(dealerHand, 'dealer');
  }, 1310);
}

function messageWinner(who, why) {
  if (why.toUpperCase() === 'BLACKJACK') {
    if (who == 'player') {
      $('#message').html("Player wins with Black Jack!");
      playerWinCount++;
    } else if (who == 'dealer') {
      $('#message').html("Dealer wins with Black Jack!");
      dealerWinCount++;
    } else {
      $('#message').html("PUSH! Dealer and Player hit Black Jack");
    }
  } else if (why.toUpperCase() === 'BUST') {
    if (who == 'player') {
      $('#message').html("Player BUST!");
       dealerWinCount++;
    } else if (who == 'dealer') {
      $('#message').html("Dealer BUST!");
       playerWinCount++;
    }
  } else 
  { //Straight Win
    if (who == 'player') {
      $('#message').html("You beat the Dealer!");
       playerWinCount++;
    } else {
      $('#message').html("The Dealer beat you");
      dealerWinCount++;
    }
  }

  //Update win count
  

    $('.dealer-wins').html(dealerWinCount);
  $('.player-wins').html(playerWinCount);

}

// function messageBlackJack(who) {
//   if (who == 'player') {
//     $('#message').html("Player wins with Black Jack!");
//   } else if (who == 'dealer') {
//     $('#message').html("Dealer wins with Black Jack!");
//   } else {
//     $('#message').html("PUSH! Dealer and Player hit Black Jack");
//   }
// }

function checkBlackJack(hand) {
  var handTotal = calcHandTotal(hand);
  var gotBlackJack = false;
  if (handTotal.softTotal === 21) {
    gotBlackJack = true;
  }
  return gotBlackJack;
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
    if (aceCnt > 1) {
      aceCnt = 1;
    }
    var temp = total + (10 * aceCnt);
    if (temp > 21) { //Ace will only add 1 point .. don't bust
      aceTotal = total;
    } else {
      aceTotal = total + (10 * aceCnt);
    }
  }

  var idToGet = '.' + who + '-total';
  //set dealer-total or player-total
  if (total === aceTotal) {
    $(idToGet).html(total);
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

// function bust(who) {
//   if (who === 'player') {
//     $('#message').html("Player BUST!");
//     gameOver('dealer');
//     // $('#hit-button').prop('disabled', true);
//     // $('#stand-button').prop('disabled', true);
//   } else {
//     $('#message').html("Dealer BUST!");

//   }

// }

function gameOver(winner) {
  $('#hit-button').prop('disabled', true);
  $('#stand-button').prop('disabled', true);
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