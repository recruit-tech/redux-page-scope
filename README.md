# redux-page-scope

## Installation

```
npm install --save redux-page-scope
```

## Usage

### Installing middlewares

```javascript
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import pageScopeMiddleware from 'redux-page-scope';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(
    routerMiddleware(browserHistory),
    pageScopeMiddleware()
  )
);
```

### Installing Reducers

```javascript
import { combineReducers, createStore } from 'redux';
import { routerReducer } from 'react-router-redux';
import { pageScopeReducer } from 'redux-page-scope';

const store = createStore(combineReducers({
  routing: routerReducer,
  page: pageScopeReducer(combineReducers({
    // your reducers for page scope.
  })),
  ...
}), initialState);
```
