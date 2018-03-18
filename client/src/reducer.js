import {Map} from 'immutable';

import {combineReducers} from 'redux';

import {ACTIONS} from './constants';

function newQuery(state = Map({loading: false}), action) {
  switch(action.type) {
    case ACTIONS.SUBMITTING_NEW_QUERY:
      return state.set('loading', true);
  }
  return state;
}

module.exports = combineReducers({
  newQuery
});
