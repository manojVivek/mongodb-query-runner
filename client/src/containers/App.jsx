import Header from './Header';
import React from 'react';
import RunQueueList from './RunQueueList';

class MongoQueryRunnerApp extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <RunQueueList />
      </div>
    );
  }

}

module.exports = MongoQueryRunnerApp;
