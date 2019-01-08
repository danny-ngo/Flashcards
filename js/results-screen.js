/*
 * Author: Danny Ngo
 * Class for results screen, where user is presented with their stats when the
 * end of the deck is reached, and the option to restart or return to menu.
 */

class ResultsScreen {
  constructor(containerElement, app) {
    this.containerElement = containerElement;
    this.app = app;

    // bind methods
    this.continueSameDeck = this.continueSameDeck.bind(this);
    this.reset = this.reset.bind(this);

    // event listeners
    const toMenu = document.querySelector(".to-menu");
    toMenu.addEventListener('click', this.reset);

    const continueBox = document.querySelector(".continue");
    continueBox.addEventListener('click', this.continueSameDeck);
  } // end constructor

  show(numberCorrect, numberWrong) {
    this.containerElement.classList.remove('inactive');
  } // end show

  hide() {
    this.containerElement.classList.add('inactive');
  } // end hide

  // Receives update from app, then updates results screen
  update(message) {
    if (message === 'return to menu') {
      this.hide();
    }
    else if (message === 'update stats') {
      const percentBox = document.querySelector(".percent");
      percentBox.textContent = this.app.percentage;
    }
    else if (message === 'show results') {
      this.show();
      const continueBox = document.querySelector(".continue");
      const percent = document.querySelector(".percent").textContent;
      if (percent === '100') {
        continueBox.textContent = "Start over";
      }
      else {
        continueBox.textContent = "Continue";
      }
    }
  } // end update

  // Continue with same deck of flashcards
  continueSameDeck(event) {
    this.app.continueSameDeck();
    this.hide();
  } // end continueSameDeck

  // Return to menu
  reset(event) {
    this.app.returnToMenu();
  } // end reset
} // end ResultsScreen class
