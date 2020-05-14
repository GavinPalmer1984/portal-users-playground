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
        // user.size = diffWeeks > 52 ? 1 : 52 - diffWeeks;
        // user.size = diffDays > 30 ? 1 : 30 - diffDays;
        user.size = diffHours > 72 ? 1 : 72 - diffHours
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
