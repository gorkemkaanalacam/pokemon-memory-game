import React, {useState, useEffect, useRef} from "react"
import ReactCardFlip from 'react-card-flip';
import './App.css';
import {cardList} from './cards';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Card = ({card, handleCardClick, enableClick }) => {
  const [isFlipped, setIsFlipped] = useState(card.flipped);

  useEffect(() => {
      setIsFlipped(card.flipped);
  }, [card.flipped]);

  const handleClick = () => {
    if(enableClick.current){
      handleCardClick(card);
    }
  };

  return(
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" flipSpeedBackToFront={0.4} flipSpeedFrontToBack={0.4}>
      <div className='CardFront' onClick={handleClick}>
          <img className="FrontImage" src="https://img.freepik.com/premium-vector/award-game-leaders-gaming-complex-top-cartoon-brilliant-vector-illustration_81894-5167.jpg" alt=''/>
      </div>
      <div className='CardBack'>
          <img className="BackImage" src={card.img} alt=''/>
      </div>
    </ReactCardFlip>
  )
};

function App() {
  const [cards, setCards] = useState(cardList);
  const [selectedCard, setSelectedCard] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const enableClick = useRef(true);

  useEffect(() => {
    const flippedCards = cards.filter(c => c.flipped);
    if(flippedCards.length === 8){
      setTimeout(() => {
        cardList.forEach(c => c.flipped = false);
        setOpenPopup(true);
      }, 600);
    }
  }, [cards]);

  const updateCard = (card, flipped) => {
    let newCards = [...cards];
    newCards.find(c => c.id === card.id).flipped = flipped;
    setCards(newCards);
  }

  const handleCardClick = (card) => {
      if(selectedCard){
        enableClick.current = false;
        updateCard(card, true);
        setTimeout(() => {
          if(selectedCard.pokemonId !== card.pokemonId){
            updateCard(selectedCard, false);
            updateCard(card, false);
          }
          setSelectedCard();
          enableClick.current = true;
        }, 600);
      }
      else{
        setSelectedCard(card);
        updateCard(card, true);
      }
  }

  const handlePlayAgainClick = () => {
    cardList.forEach((c, i) => {
      const index = Math.round(Math.random() * (7 - i));
      [cardList[7 - i], cardList[index]] = [cardList[index], cardList[7 - i]];
    });
    setCards(cardList);
    setOpenPopup(false);
  }

  return (
    <div className="App">
      <Popup open={openPopup} modal={true} closeOnDocumentClick={false} position="center center">
          <div className="PopupTitle">Congrats !!!</div>
            <div className="PopupButton" onClick={handlePlayAgainClick}>
              Play Again
            </div>
      </Popup>
      <div className="CardsContainer">
        {
          cards.map((card) => 
          <Card 
          key={card.id} 
          card={card} 
          handleCardClick={handleCardClick} 
          selectedCard={selectedCard}
          enableClick={enableClick}
          />)
        }
      </div>
    </div>
  );
}

export default App;
