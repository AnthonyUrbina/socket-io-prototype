import React from 'react';
import socketClient from 'socket.io-client';
const server = 'http://192.168.1.89:3000/';
const socket = socketClient(server);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.myref = React.createRef();
    this.state = {
      player1deck: this.props.cards.slice(5, 10),
      player2deck: this.props.cards.slice(0, 5),
      player1play: null,
      player2play: null,
      battlefield: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.battleWinner = this.battleWinner.bind(this);
  }

  componentDidMount() {
    socket.on('player 1 card flipped response', card => {
      this.setState({ player1play: card });
    });
    socket.on('player 2 card flipped response', card => {
      this.setState({ player2play: card });
    });
  }

  checkBattlefield() {
    if (this.state.player1play && this.state.player2play) {
      setTimeout(this.battleWinner, 1000);
    }
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
      const battlefield = [this.state.player1play, this.state.player2play];

      let player1deckCopy = [...this.state.player1deck];
      let player2deckCopy = [...this.state.player2deck];

      if (this.state.player1play > this.state.player2play) {
        player1deckCopy = player1deckCopy.concat(battlefield);
        this.setState({ player1play: null, player2play: null, player1deck: player1deckCopy });
      } else {
        player2deckCopy = player2deckCopy.concat(battlefield);
        this.setState({ player1play: null, player2play: null, player2deck: player2deckCopy });
      }
      return <p>{this.checkBattlefield()}</p>;
    }

  }

  render() {
    return (
      <>
        <div>
          player 1
          <button data-view="player1" onClick={this.handleClick}>flip card</button>
          <p className='deck'> deck: {this.state.player1deck}</p>

          <p>{this.showCardP1()}</p>
        </div>
        <div>
          player 2
          <button data-view="player2" onClick={this.handleClick}>flip card</button>
          <p className='deck'> deck: {this.state.player2deck}</p>
          <p>{this.showCardP2()}</p>
        </div>
        {this.checkBattlefield()}
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
