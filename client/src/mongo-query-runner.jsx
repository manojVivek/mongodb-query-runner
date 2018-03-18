import App from './containers/App';
import ReactDom from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Reducer from './reducer';
import { Provider } from 'react-redux';
import React from 'react';

let middlewares = [thunk];

if (__DEV__) {
  const {logger} = require('redux-logger');
  middlewares.push(logger);
}

const store = applyMiddleware(...middlewares)(createStore)(Reducer);
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('MongoQueryRunnerApp')
);
