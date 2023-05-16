/*
  Hmm... So you like reading people's code huh? You're weird.
  But it's okay. I'm reading this with you too. So you're not alone.
  Guess we have something in common.

  Hope you like my code. It's not THE BEST, but it's pretty damn good.
  Put this together in a day... Functions well enough.
*/

import './App.css';

// IMPORTING THE LOGO... DUHHHH
import logo from './img/kanmasuLOGO.png';
import * as wanakana from 'wanakana';
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

class Card {
  static cardCount = 0;

  // Constructor for the Card class, using two properties only for now (kanji and hiragana)
  constructor(kanji, hiragana, definition) {
    this.kanji = kanji;
    this.hiragana = hiragana;
    this.definition = definition;
    this.romaji = this.getRomajiFromKanji(kanji, hiragana);
    this.cardNo = Card.cardCount++;
  }

  // My esoteric function to get the romaji from the kanji and hiragana... Fancy!
  getRomajiFromKanji(kanji, hiragana) {
    const kanjiChars = kanji.split('');
    const hiraganaChars = hiragana.split('');

    let currentIndex = 0;
    const romajiParts = kanjiChars.map(kanjiChar => {
      const hiraganaPart = [];
      while (currentIndex < hiraganaChars.length && !kanjiChars.includes(hiraganaChars[currentIndex])) {
        hiraganaPart.push(hiraganaChars[currentIndex]);
        currentIndex++;
        hiraganaPart.push('•');
      }
      hiraganaPart.push(hiraganaChars[currentIndex]);
      currentIndex++;
      return wanakana.toRomaji(hiraganaPart.join('')).toUpperCase();
    });

    return romajiParts.join('').slice(0, -1);
  }
}

function App() {
  const [kanji, setKanji] = useState('');
  const [hiragana, setHiragana] = useState('');
  const [definition, setDefinition] = useState('');
  const [showDefinition, setShowDefinition] = useState(false);

  // Used for encryption...
  const secretKey = 'santanamurishi';

  // Used for Preview-Card
  const [isHidden, setIsHidden] = useState(true);

  // Used for Main-Div
  const [isMainDivHidden, setIsMainDivHidden] = useState(false);

  // Used for Card-Array
  const [cards, setCards] = useState([]);

  // Used for Create-Card
  const [isCreateCardHidden, setIsCreateCardHidden] = useState(true);

  // Used for View-All-Cards
  const [isViewAllCardsHidden, setIsViewAllCardsHidden] = useState(true);
  const viewAllCards = () => {
    setIsViewAllCardsHidden(!isViewAllCardsHidden);
    // Toggle off Create-Card
    setIsCreateCardHidden(true);
    // Toggle off Preview-Card
    setIsHidden(true);
    // Toggle main div
    setIsMainDivHidden(true);
  };
  const viewAllCardsStyle = {
    display: isViewAllCardsHidden ? 'none' : 'block',
  };

  const toggleCreateCard = () => {
    setIsCreateCardHidden(!isCreateCardHidden);
    // Toggle off View-All-Cards
    setIsViewAllCardsHidden(true);
    // Toggle off Preview-Card
    setIsHidden(true);
    // Toggle main div
    setIsMainDivHidden(true);
  };

  const createCardStyle = {
    display: isCreateCardHidden ? 'none' : 'block',
  };

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  const previewCard = () => {
    setKanji(document.getElementById('kanji-input').value);
    setHiragana(document.getElementById('hiragana-input').value);
    setDefinition(document.getElementById('definition-input').value);
    setIsHidden(false);
  };

  const createCard = () => {
    const newCard = {
      kanji: document.getElementById('kanji-input').value,
      hiragana: document.getElementById('hiragana-input').value,
      definition: document.getElementById('definition-input').value,
    };

    setCards([...cards, newCard]);
    setIsHidden(true);
  }

  const HiddenStyle = {
    display: isHidden ? 'none' : 'block',
  };

  const toggleMainDiv = () => {
    setIsMainDivHidden(!isMainDivHidden);
  };

  const mainDivStyle = {
    display: isMainDivHidden ? 'none' : 'block',
  };

  const saveCards = () => {
    if (cards.length === 0) {
      alert('The deck is empty. Please add some cards first.');
      return;
    }

    const content = cards.map((card, index) => `${index + 1},${card.kanji},${card.hiragana},${card.definition}`).join('\n');
    const encryptedContent = CryptoJS.AES.encrypt(content, secretKey).toString();
    const blob = new Blob([encryptedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deck.kms';
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const loadCards = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.kms';
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const encryptedContent = e.target.result;
        const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, secretKey).toString(CryptoJS.enc.Utf8);
        const lines = decryptedContent.split('\n');
        const newCards = lines.map((line) => {
          const [_, kanji, hiragana, definition] = line.split(',');
          return { kanji, hiragana, definition };
        });
        setCards(newCards);
      };
      reader.readAsText(file, 'UTF-8');
    };
    fileInput.click();
  };

  const RomajiToKanji = (kanji, hiragana) => {
    const kanjiChars = kanji.split('');
    const hiraganaChars = hiragana.split('');

    let currentIndex = 0;
    const romajiParts = kanjiChars.map(kanjiChar => {
      const hiraganaPart = [];
      while (currentIndex < hiraganaChars.length && !kanjiChars.includes(hiraganaChars[currentIndex])) {
        hiraganaPart.push(hiraganaChars[currentIndex]);
        currentIndex++;
        hiraganaPart.push('•');
      }
      hiraganaPart.push(hiraganaChars[currentIndex]);
      currentIndex++;
      return wanakana.toRomaji(hiraganaPart.join('')).toUpperCase();
    });

    return romajiParts.join('').slice(0, -1);
  };

  return (
    <div className="App">

        <div className="topdiv">
            <img src={logo} className="App-logo" alt="logo" />

            <div className="clickable_button">
              <div className="button_text_JP" onClick={toggleCreateCard}>
                作
              </div>
              CREATE CARD
            </div>

            <div className="clickable_button" onClick={viewAllCards}>
              <div className="button_text_JP">
                見
              </div>
              VIEW ALL CARDS
            </div>

            {/* <div className="clickable_button">
              <div className="button_text_JP">
                練
              </div>
              TEST DECK
            </div> */}

            <div className="clickable_button" onClick={saveCards}>
              <div className="button_text_JP">
                保
              </div>
              SAVE DECK
            </div>

            <div className="clickable_button" onClick={loadCards}>
              <div className="button_text_JP">
                読
              </div>
              LOAD DECK
            </div>

        </div>

        <div className="maindiv" style={mainDivStyle}>
          <div className="main-div-title">
            Welcome to 漢マス (KANMASU)!
          </div>
          <div className="main-div-content">
            Kanmasu is a tool, currently in development, that allows you to create and view simple flashcards for studying Japanese.
            There are currently four options, which can be accessed by clicking the buttons above:

            <div className="spacer"></div>

            <div className="main-div-example">
              <div className="clickable_button_2">
                <div className="button_text_JP_2">
                  作
                </div>
                {/* CREATE CARD */}
              </div>
              {/* <div className="spacer"></div> */}
              CREATE CARD allows you to create a new card. You can preview the card before creating it. This is useful for checking if the card looks correct.
              Once you have verified that the card looks correct, you can click CREATE CARD to add it to the deck. 
            </div>

            <div className="main-div-example">
              <div className="clickable_button_2">
                <div className="button_text_JP_2">
                  見
                </div>
                {/* CREATE CARD */}
              </div>
              {/* <div className="spacer"></div> */}
              VIEW ALL CARDS allows you to view all the cards that you have created thus far. You can also delete cards from this view, by clicking on a card.

            </div>

            <div className="main-div-example">
              <div className="clickable_button_2">
                <div className="button_text_JP_2">
                  保
                </div>
                {/* CREATE CARD */}
              </div>
              {/* <div className="spacer"></div> */}
              SAVE DECK allows you to save the deck that you have created thus far. This will download a file to your computer. You can load this file later by clicking LOAD DECK.
              These decks are encrypted into the file format .kms and can only be decrypted through this application.
            </div>

            <div className="main-div-example">
              <div className="clickable_button_2">
                <div className="button_text_JP_2">
                  読
                </div>
                {/* CREATE CARD */}
              </div>
              {/* <div className="spacer"></div> */}
              LOAD DECK allows you to load a deck that you have previously saved. This will prompt you to select a file from your computer. You can only load files with the .kms extension,
              otherwise the application will not be able to decrypt the file.
            </div>
          </div>
        </div>

        <div className="create-card-div" style={createCardStyle}>
          <div className="create_card_div_title">
            CREATE CARD
          </div>
          <div className="input-container">
            <label htmlFor="kanji-input">Kanji:</label>
            <input type="text" id="kanji-input" name="kanji" placeholder="Kanji" />
            <label htmlFor="hiragana-input">Hiragana:</label>
            <input type="text" id="hiragana-input" name="hiragana" placeholder="Hiragana" />
            <label htmlFor="definition-input">Definition:</label>
            <input type="text" id="definition-input" name="definition" placeholder="Definition" />
          </div>
          <div className="buttons-container">
            <button className="clickable_button" onClick={previewCard}>
              <div className="button_text_JP">
                試
              </div>
              Preview Card
            </button>
            <button className="clickable_button" onClick={createCard}>
              <div className="button_text_JP">
                作
              </div>
              Create Card
            </button>
          </div>

          </div>

          <div className="preview-card-div" onClick={toggleDefinition} style={HiddenStyle}>
        {showDefinition ? (
          <div className="card-definition">{definition}</div>
        ) : (
          <>
            <div className="card-kanji">{kanji}</div>
            <div className="card-hiragana">{hiragana}</div>
            <div className="card-romaji">
              {RomajiToKanji(kanji, hiragana)}
            </div>
          </>
        )}
      </div>

      


          <div className="view-all-cards-div" style={viewAllCardsStyle}>
                <div className="view_all_cards_div_title">
                    VIEW ALL CARDS
                </div>
                <div className="view_all_cards_div_cards">
                    {cards.map((card, index) => (
                        <div key={index} className="preview-card-div">
                            <div className="card-kanji">{card.kanji}</div>
                            <div className="card-hiragana">{card.hiragana}</div>
                            <div className="card-romaji">{RomajiToKanji(card.kanji, card.hiragana)}</div>
                            <div className="card-definition">{card.definition}</div>
                        </div>
                    ))}
          </div>
        </div>



    </div>
  );
}

export default App;
