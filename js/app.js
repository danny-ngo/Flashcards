/*
 * Author: Danny Ngo
 * App class, controls the app's flow and behaviour, and communicates with the
 * flashcard, menu, and results screens.
 */

class App {
  constructor() {
    // initialize deck
    this.deck = {};
    this.cards = [];
    this.cardNum = 0;

    // initialize stats
    this.correct = 0;
    this.wrong = 0;
    this.percentage = null;

    // bind methods
    this.selectDeck = this.selectDeck.bind(this);

    // instantiates menu, flashcard, and results screens
    const menuElement = document.querySelector('#menu');
    this.menu = new MenuScreen(menuElement, this.selectDeck);

    const mainElement = document.querySelector('#main');
    this.flashcards = new FlashcardScreen(mainElement, this);

    const resultElement = document.querySelector('#results');
    this.results = new ResultsScreen(resultElement, this);
  } // end constructor

  // Sets the app's deck to user's selection
  selectDeck(deck) {
    this.deck = deck;
    this.createCards();
    this.updateScreens('deck selected');
  } // end selectDeck

  // Creates an array of flashcards for the selected deck
  createCards() {
    const flashcardContainer = document.querySelector('#flashcard-container');
    const words = this.deck.words;
    for (const word in words) {
      const definition = words[word];
      // instantiate new Flashcard and add it to cards array
      const card = new Flashcard(flashcardContainer, word, definition, this);
      this.cards.push(card);
    }
    this.cards[this.cardNum].show();
  } // end createCards

  // Sends message to screens when any updates are made to the screen
  updateScreens(message) {
    this.menu.update(message);
    this.flashcards.update(message);
    this.results.update(message);
  } // end updateScreens

  // Handles the card the user answered
  handleCurrentCard(correct) {
    let card = this.cards[this.cardNum];
    card.destroy(); // remove flashcard object from DOM
    if (correct) { // user answered current card correctly
      this.cards.splice(this.cardNum--, 1); // remove flashcard from array
    }
    else {  // user answered incorrectly
      const flashcardContainer = document.querySelector('#flashcard-container');
      const newCard = new Flashcard(flashcardContainer, card.word, card.definition, this);
      this.cards.splice(this.cards.indexOf(card), 1, newCard);  // replace with new Flashcard object
    }
  } // end handleCurrentCard

  // Updates number of correct, wrong, and the percentage, then updates screen
  updateStats(newCorrect, newWrong) {
    this.correct += newCorrect;
    this.wrong += newWrong;
    this.percentage =  Math.round(100 * this.correct / (this.correct + this.wrong));
    this.updateScreens('update stats');
  } // end updateStats

  // Moves to the next card
  nextCard(correct) {
    this.handleCurrentCard(correct);
    this.cardNum++;  // move to "next card"
    if (this.cardNum < this.cards.length) { // cards remaining in deck
      this.cards[this.cardNum].show();  // reveal the next card
    }
    else {  // no more cards in deck
      this.updateScreens('show results');
    }
  } // end nextCard

  // Continues with same deck of flashcards
  continueSameDeck() {
    if (this.cards.length === 0) {  // no more incorrect cards in deck
      this.restartDeck(); // restarts the deck
    }
    else {  // incorrect cards in deck --> reset wrong, continue round
      this.cardNum = 0;
      this.wrong = 0;
      this.updateScreens('update stats');
      this.cards[0].show();
      this.flashcards.show();
    }
  } // end continueSameDeck

  // Restarts the app with the same deck of flashcards
  restartDeck() {
    this.createCards();
    this.correct = 0;
    this.wrong = 0;
    this.percentage = null;
    this.flashcards.show();
    this.updateScreens('update stats');
  } // end restartDeck

  // Resets app, returning back to the menu screen
  returnToMenu() {
    // resetting the deck
    this.deck = {};
    this.cards = [];
    this.cardNum = 0;
    // resetting the stats
    this.correct = 0;
    this.wrong = 0;
    this.percentage = null;
    this.updateScreens('return to menu');
  } // end returnToMenu
} // end App class
