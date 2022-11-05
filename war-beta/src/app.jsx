/* eslint-disable no-console */
import React from 'react';
import socketClient from 'socket.io-client';
const server = 'http://192.168.1.89:3000/';
const socket = socketClient(server);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1deck: this.props.cards.slice(5, 10),
      player2deck: this.props.cards.slice(0, 5),
      player1play: null,
      player2play: null,
      battlefield: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log('hi');
    socket.on('player 1 card flipped response', card => {
      this.setState({ player1play: card });
    });
    socket.on('player 2 card flipped response', card => {
      this.setState({ player2play: card });
    });
  }

  handleClick(event, props) {
    event.target.dataset.view === 'player1'
      ? socket.emit('player 1 card flipped', this.state.player1deck[0])
      : socket.emit('player 2 card flipped', this.state.player2deck[0]);

    const player1deckCopy = [...this.state.player1deck];
    const player2deckCopy = [...this.state.player2deck];

    event.target.dataset.view === 'player1'
      ? player1deckCopy.splice(0, 1)
      : player2deckCopy.splice(0, 1);
    this.setState({ player1deck: player1deckCopy, player2deck: player2deckCopy });
  }

  showCardP1() {
    return this.state.player1play;
  }

  showCardP2() {
    return this.state.player2play;
  }

  battleWinner() {
    if (this.state.player1play && this.state.player2play) {
      let winningCard = null;
      const battlefield = [this.state.player1play, this.state.player2play];

      let player1deckCopy = [...this.state.player1deck];
      let player2deckCopy = [...this.state.player2deck];
      console.log('hi');
      if (this.state.player1play > this.state.player2play) {
        winningCard = this.state.player1play;
        player1deckCopy = player1deckCopy.concat(battlefield);
        console.log('player1', player1deckCopy);
        this.setState({ player1play: null, player2play: null, player1deck: player1deckCopy });
      } else {
        winningCard = this.state.player2play;
        player2deckCopy = player2deckCopy.concat(battlefield);
        console.log('player2', player2deckCopy);
        this.setState({ player1play: null, player2play: null, player2deck: player2deckCopy });
      }
      return <p>{winningCard}</p>;
    }
  }

  render() {
    return (
      <>
        <div>
          player 1
          <button data-view="player1" onClick={this.handleClick}>flip card</button>
          <p>{this.showCardP1()}</p>
        </div>
        <div>
          player 2
          <button data-view="player2" onClick={this.handleClick}>flip card</button>
          <p>{this.showCardP2()}</p>
        </div>
      </>
    );
  }
}

/*
user 1 flips a card
user 2 flips a card
get the value of the largest card
find out who's card it is
once you find out,
put both cards at the end of the winners deck (array)
when a user places a card it, should be the first index in their deck (array)
and it should be removed immediatley

flip card
- user clicks button
- if player 1 flips emit "player 1 flipped" to backend
- backend recieves the card that was placed
- sends it back
- react updates state
- react re-renders with new card on field
*/
