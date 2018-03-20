import {Map} from 'immutable';

import {combineReducers} from 'redux';

import {ACTIONS} from './constants';

const defaultCode = 'rs.slaveOk();\n';

function newQuery(
  state = Map({loading: false, shown: false, code: defaultCode}),
  action
) {
  switch(action.type) {
    case ACTIONS.SUBMITTING_NEW_QUERY:
      return state.set('loading', true);
    case ACTIONS.SUBMITTING_DONE:
      return state.set('loading', false);
    case ACTIONS.RESET_QUERY_DIALOG:
      return state.set('shown', false)
        .set('code', defaultCode);
    case ACTIONS.RESET_QUERY_DIALOG_CODE:
      return state.set('code', defaultCode);
    case ACTIONS.UPDATE_CODE:
      return state.set('code', action.code);
    case ACTIONS.QUERY_FORM_STATE_CHANGE:
      return state.set('shown', action.shown);
  }
  return state;
}

module.exports = combineReducers({
  newQuery
});
