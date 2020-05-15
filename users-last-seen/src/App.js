import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import React, { Component } from 'react';
import './App.css';
import BubbleChart from './visualizations/BubbleChart';

class App extends Component {

  state = {
    users: {},
  };

  componentDidMount() {
    const client = new ApolloClient({
      uri: 'http://localhost:3000/graphql',
    });
    const USERS = gql`
      {
        DiscordUser {
          id
          username
          discriminator
          avatar
          bumped
          __typename
        }
      }
`;

    client.query({ query: USERS }).then((result) => {
      const now = new Date();
      result.data.DiscordUser.forEach((user) => {
        const lastSeen = new Date(user.bumped * 1000);
        const diffTime = Math.abs(now - lastSeen);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffHours / 24);
        const diffWeeks = Math.ceil(diffDays / 7);
        // user.size = diffHours > (30 * 24) ? 4 : (30 * 24) - diffHours; // 30 days
        // user.size = diffHours > (10 * 24) ? 4 : (10 * 24) - diffHours; // 10 days
        user.size = diffHours > (5 * 24) ? 4 : (5 * 24) - diffHours; // 5 days
        user.pic = user.avatar === 'null' ?  null : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
      });
      this.setState({ users: result.data.DiscordUser });
    });

  }

  render() {
    const data = this.state.users;

    return (
      <div className="UsersByLastSeen">
        <BubbleChart data={data} />
      </div>
    );
  }
}

export default App;
