/*
 * Author: Danny Ngo
 * Class for a single flashcard, controls its behaviour.
 */

class Flashcard {
  constructor(containerElement, frontText, backText, app) {
    this.containerElement = containerElement;
    this.word = frontText;
    this.definition = backText;
    this.app = app;

    // Create flashcard in DOM
    this.flashcardElement = this.createFlashcardDOM(frontText, backText);
    this.containerElement.append(this.flashcardElement);

    // Binding action methods
    this.flipCard = this.flipCard.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    // Attaching event listeners to actions
    this.flashcardElement.addEventListener('pointerup', this.flipCard);
    this.flashcardElement.addEventListener('pointerdown', this.dragStart);
    this.flashcardElement.addEventListener('pointerup', this.dragEnd);
    this.flashcardElement.addEventListener('pointermove', this.dragMove);

    // State of flashcard
    this.originX = null;
    this.originY = null;
    this.currentX = null;
    this.currentY = null;
    this.dragStarted = false;
    this.correct = false;
    this.incorrect = false;

    this.hide(); // hide card by default
  } // end constructor

  show() {
    this.flashcardElement.classList.remove('inactive');
  } // end show

  hide() {
    this.flashcardElement.classList.add('inactive');
  } // end hide

  destroy() {
    this.flashcardElement.remove();
  } // end destroy

  // Creates the DOM object for a flashcard.
  createFlashcardDOM(frontText, backText) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('flashcard-box');
    cardContainer.classList.add('show-word');

    // setting frontText to front of card
    const wordSide = document.createElement('div');
    wordSide.classList.add('flashcard');
    wordSide.classList.add('word');
    wordSide.textContent = frontText;

    // setting backText to back of card
    const definitionSide = document.createElement('div');
    definitionSide.classList.add('flashcard');
    definitionSide.classList.add('definition');
    definitionSide.textContent= backText;

    // adding front and back of card to container
    cardContainer.appendChild(wordSide);
    cardContainer.appendChild(definitionSide);
    return cardContainer;
  } // end createFlashcardDOM

  flipCard(event) {
    this.flashcardElement.classList.toggle('show-word');
  } // end flipCard

  // User started dragging flashcard
  dragStart(event) {
    this.originX = event.clientX;
    this.originY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.dragStarted = true;
  } // end dragStart

  // User is dragging flashcard, handles behaviour as card is being dragged
  dragMove(event) {
    if (!this.dragStarted) {
      return;
    }
    event.preventDefault();
    // Deactivate bouncing back
    event.currentTarget.classList.remove("bounce");

    // Flashcard movement
    this.currentX = event.clientX - this.originX;
    this.currentY = event.clientY - this.originY;
    const rotateDeg = 0.2*this.currentX;
    event.currentTarget.style.transform =
      'translate(' + this.currentX + 'px, ' + this.currentY + 'px)' +
      ' rotate(' + rotateDeg + 'deg)';

    // Update background color and status depending on location of card
    const appContainer = document.querySelector('body');
    if (this.currentX >= 150) { // 150 px to the right
      appContainer.style.backgroundColor = "#97b7b7";
      if (!this.correct) {
        this.app.updateStats(1, 0);
        this.correct = true;
      }
    } // end right side handler
    else if (this.currentX <= -150) { // 150 px to the left
      appContainer.style.backgroundColor = "#97b7b7";
      if (!this.incorrect) {
        this.app.updateStats(0, 1);
        this.incorrect = true;
      }
    } // end left side handler
    else {  // in the middle
      appContainer.style.backgroundColor = "#d0e6df";
      if (this.correct) {
        this.app.updateStats(-1, 0);
        this.correct = false;
      }
      if (this.incorrect) {
        this.app.updateStats(0, -1);
        this.incorrect = false;
      }
    } // end middle handler
  } // end dragMove

  // User stopped dragging flashcard
  dragEnd(event) {
    this.dragStarted = false;
    if (this.currentX < 150 && this.currentX > -150) {  // card not dragged far enough
      event.currentTarget.classList.add("bounce");
    }
    else {  // card dragged far enough
      this.app.nextCard(this.correct);
      const appContainer = document.querySelector('body');
      appContainer.style.backgroundColor = "#d0e6df";
    }
  } // end dragEnd
} // end Flashcard class
