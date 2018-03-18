import {ACTIONS} from './constants';
import {Buffer} from 'buffer';



export function submitScript(code) {
  return dispatch => {
    console.log(submittingNewQuery(Buffer.from(code).toString('base64')));
    dispatch(submittingNewQuery(Buffer.from(code).toString('base64')))

  };
}

function submittingNewQuery() {
  return {
    type: ACTIONS.SUBMITTING_NEW_QUERY,
  }
}
