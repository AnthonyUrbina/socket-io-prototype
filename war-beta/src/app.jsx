import React from 'react';
import socketClient from 'socket.io-client';
const server = 'http://localhost:3000/';
const socket = socketClient(server);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  componentDidMount() {
    socket.on('message response', msg => {
      const messagesCopy = [...this.state.messages];
      messagesCopy.push(msg);
      this.setState({ value: '', messages: messagesCopy });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit('message', this.state.value);
    this.setState({ value: '' });
  }

  handleUsernameChange(event) {
    this.setState({ value: event.target.value });
  }

  receiveMessage() {
    let msgId = 0;
    const list = this.state.messages.map(msg => <li key={msgId++}>{msg}</li>);
    return list;
  }

  render() {
    return (
      <>
        <ul id="messages">{this.receiveMessage()}</ul>
        <form onSubmit={this.handleSubmit} id="form" action="">
          <input value={this.state.value} onChange={this.handleUsernameChange} id="input"/><button>Send</button>
        </form>
      </>
    );
  }
}
