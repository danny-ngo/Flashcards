/*
 * Author: Danny Ngo
 * Classes for menu screen and menu buttons, where user chooses a flashcard deck.
 */

class MenuScreen {
  constructor(containerElement, selectedDeck) {
    this.containerElement = containerElement;

    // bind methods
    this.update = this.update.bind(this);

    // Add buttons to menu
    const choicesMenu = containerElement.querySelector("#choices");
    this.menuButtons = [];
    for (let i = 0; i < FLASHCARD_DECKS.length; i ++) {
      let deck = FLASHCARD_DECKS[i];
      // instantiate new MenuButton and add it to menuButtons array
      const menuButton = new MenuButton(choicesMenu, deck, selectedDeck);
      this.menuButtons.push(menuButton);
    }
  } // end constructor

  show() {
    this.containerElement.classList.remove('inactive');
  } // end show

  hide() {
    this.containerElement.classList.add('inactive');
  } // end hide

  // Receives message from app and updates menu screen
  update(message) {
    if (message === 'deck selected') {
      this.hide();
    }
    if (message === 'return to menu') {
      this.show();
    }
  } // end update
} // end MenuScreen class

class MenuButton {
  constructor(choicesMenu, deck, onClickCallback) {
    this.choicesMenu = choicesMenu;
    this.text = deck.title;
    this.deck = deck;

    // Creating button in DOM and adding to menu
    const button = document.createElement('div');
    button.textContent = this.text;
    choicesMenu.append(button);

    // Event binding and listener
    this.onClickCallback = onClickCallback;
    this.onClick = this.onClick.bind(this);
    button.addEventListener('click', this.onClick);
  } // end constructor

  onClick() {
    this.onClickCallback(this.deck);
  } // end onClick
} // end MenuButton class
