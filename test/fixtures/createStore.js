import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { default as pageScopeMiddleware, pageScopeReducer } from '../../src';

export const actions = [];

function logMiddleware(store) {
  return (next) => (action) => {
    actions.push(action);
    return next(action);
  };
}

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'ADD':
      return { value: state.value + action.payload };
    default:
      return state;
  }
}

export default function (initState) {
  return createStore(combineReducers({
    routing: routerReducer,
    page: pageScopeReducer(combineReducers({
      counter: counterReducer,
    })),
  }), {
    routing: {
      locationBeforeTransitions: {
        key: '0',
        action: 'PUSH',
        pathname: '/',
      },
    },
  }, applyMiddleware(
    pageScopeMiddleware(),
    logMiddleware
  ));
}
