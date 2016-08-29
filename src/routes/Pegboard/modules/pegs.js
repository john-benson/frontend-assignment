import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------


// ------------------------------------
// Actions
// ------------------------------------


/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */


export const actions = {

}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS([
  { id: '1', x: 5, y: 3, color: '#5cb85c' },
  { id: '2', x: 9, y: 1, color: '#d9534f' },
  { id: '3', x: 2, y: 0, color: '#5bc0de' },
  { id: '4', x: 1, y: 5, color: '#f0ad4e' },
]);

export default function pegsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
