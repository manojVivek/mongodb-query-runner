import {ACTIONS} from './constants';
import {Buffer} from 'buffer';

import fetch from 'isomorphic-fetch';
import {processResponse, url} from './utils';

export function submitScript(code) {
  return dispatch => {
    dispatch(submittingNewQueryAction());
    fetch(
      url('/runQuery'),
      {
        body: JSON.stringify({code: Buffer.from(code).toString('base64')}),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }
    )
    .then(processResponse)
    .then(result => {
      dispatch(refreshQueriesAction(true));
    })
    .catch(err => {
      console.log('Error while submitting code', err);
      window.alert('Query submission failed, please try again');
    })
    .then(() => dispatch(submittingDoneAction()));
  };
}

export function resetCode() {
  return dispatch => dispatch(resetQueryDialogCodeAction());
}

export function updateCode(code) {
  return dispatch => dispatch(updateCodeAction(code));
}

export function showQueryForm(state) {
  return dispatch => dispatch(queryFormStateAction(state));
}

function submittingNewQueryAction() {
  return {
    type: ACTIONS.SUBMITTING_NEW_QUERY,
  };
}

function refreshQueriesAction(fromPrimary) {
  return {
    type: ACTIONS.REFRESH_QUERIES,
    fromPrimary,
  };
}

function resetQueryDialogAction() {
  return {
    type: ACTIONS.RESET_QUERY_DIALOG,
  };
}

function resetQueryDialogCodeAction() {
  return {
    type: ACTIONS.RESET_QUERY_DIALOG_CODE,
  };
}

function updateCodeAction(code) {
  return {
    type: ACTIONS.UPDATE_CODE,
    code,
  }
}

function queryFormStateAction(shown) {
  return {
    type: ACTIONS.QUERY_FORM_STATE_CHANGE,
    shown,
  }
}

function submittingDoneAction() {
  return {
    type: ACTIONS.SUBMITTING_DONE,
  };
}
