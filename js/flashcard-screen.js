/*
 * Author: Danny Ngo
 * Class for flashcard screen, where the user interacts with flashcards.
 */

class FlashcardScreen {
  constructor(containerElement, app) {
    this.containerElement = containerElement;
    this.app = app;
  } // end constructor

  show() {
    this.containerElement.classList.remove('inactive');
  } // end show

  hide() {
    this.containerElement.classList.add('inactive');
  } // end hide

  // Receives update from app, then updates flashcard screen
  update(message) {
    if (message === 'deck selected') {
      this.updateStatsBox();
      this.show();
    }
    else if (message === 'update stats') {
      this.updateStatsBox();
    }
    else if (message === 'return to menu' || message === 'show results') {
      this.hide();
    }
  } // end update

  // Updates stats box with number of correct and wrong answers
  updateStatsBox() {
    const correctFields = document.querySelectorAll('.correct');
    const incorrectFields = document.querySelectorAll('.incorrect');
    const numCorrect = this.app.correct;
    const numWrong = this.app.wrong;
    for (const correctField of correctFields) {
      correctField.textContent = numCorrect;
    }
    for (const wrongField of incorrectFields) {
      wrongField.textContent = numWrong;
    }
  } // end updateStatsBox
} // end FlashcardScreen class
