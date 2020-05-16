import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import gql from "graphql-tag";

import React, { Component } from 'react';
import './App.css';
import BubbleChart from './visualizations/BubbleChart';
import CirclePackingChart from "./visualizations/CirclePackingChart";

class App extends Component {

  state = {
    users: {},
    tags: {}
  };

  setUserSizeByLastSeen = (now, user) => {
    const lastSeen = new Date(user.bumped * 1000);
    const diffTime = Math.abs(now - lastSeen);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    // const diffDays = Math.ceil(diffHours / 24);
    // const diffWeeks = Math.ceil(diffDays / 7);
    // user.size = diffHours > (30 * 24) ? 4 : (30 * 24) - diffHours; // 30 days
    // user.size = diffHours > (10 * 24) ? 4 : (10 * 24) - diffHours; // 10 days
    user.size = diffHours > (5 * 24) ? 4 : (5 * 24) - diffHours; // 5 days
    return user;
  }

  componentDidMount() {
    const client = new ApolloClient({
      link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.forEach(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new HttpLink({
          uri: 'http://localhost:3000/graphql'
        })
      ]),
      cache: new InMemoryCache()
    });
    const QUERY = gql`
    {
        Tag {
            name
            children: people {
                id
                username
                avatar
            }
        }
    }
`;
    client.query({ query: QUERY, fetchPolicy: "no-cache" }).then((result) => {
      const usersByLastSeen = {};
      const usersByTags = [];
      const now = new Date();
      result.data.Tag.forEach((tag) => {
        if (tag.children.length < 6) {
          return;
        }
        tag.children.forEach((user) => {
          user.pic = user.avatar === 'null' ? null : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
          user = this.setUserSizeByLastSeen(now, user);
          usersByLastSeen[user.id] = user;
        });
        if (tag.children.length > 1) {
          usersByTags.push(tag);
        }
      });
      this.setState({ users: Object.values(usersByLastSeen), tags: usersByTags });
    });

  }

  render() {
    return (
      <div className="UsersByLastSeen">
        <div style={{display: 'flex'}}>
          <BubbleChart data={this.state.users} />
          <CirclePackingChart data={this.state.tags} />
        </div>
      </div>
    );
  }
}

export default App;
