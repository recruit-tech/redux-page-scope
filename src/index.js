import { LOCATION_CHANGE } from 'react-router-redux';
import createLruCache from 'lru-cache';
import requestAnimationFrame from 'dom-helpers/util/requestAnimationFrame';

/*
 * Action Types
 */
export const INIT_PAGE_SCOPE = '@@redux-page-scope/init';
export const SET_PAGE_SCOPE = '@@redux-page-scope/set';

/*
 * Action creators
 */
export function init() {
  return {
    type: INIT_PAGE_SCOPE,
  };
}

export function set(state) {
  return {
    type: SET_PAGE_SCOPE,
    payload: state,
  };
}

/*
 * Middleware
 */
export default function pageScopeMiddleware(options) {
  const { getPageScopedState, getRoutingState, lruCacheConfig } = Object.assign({
    getPageScopedState: (state) => state.page,
    getRoutingState: (state) => state.routing,
    lruCacheConfig: { max: 100 },
  }, options);

  const cache = createLruCache(lruCacheConfig);
  const storage = createSessionStorage();

  return ({ dispatch, getState }) => (next) => (action) => {
    if (action.type !== LOCATION_CHANGE) {
      return next(action);
    }

    const currentState = getState();
    const result = next(action); // eslint-disable-line callback-return

    const routing = getRoutingState(currentState);
    const currentKey = routing && routing.locationBeforeTransitions && routing.locationBeforeTransitions.key;
    const nextKey = action.payload.key;
    if (!currentKey || currentKey === nextKey) {
      return result;
    }

    switch (action.payload.action) {
      case 'PUSH':
        saveCurrentPageState();
        dispatchInit();
        break;
      case 'POP':
        saveCurrentPageState();
        dispatchSet();
        break;
      case 'REPLACE':
        deleteCurrentPageState();
        dispatchInit(routing.locationBeforeTransitions.pathname === action.payload.pathname);
        break;
    }

    return result;

    function saveCurrentPageState() {
      const pageScopedState = getPageScopedState(currentState);
      cache.set(currentKey, pageScopedState);
      storage && requestAnimationFrame(() => storage.set(currentKey, pageScopedState));
    }

    function deleteCurrentPageState() {
      cache.del(currentKey);
      storage && requestAnimationFrame(() => storage.del(currentKey));
    }

    function dispatchInit(keepState) {
      if (!keepState) {
        dispatch(init());
      }
    }

    function dispatchSet() {
      const savedState = cache.get(nextKey) || (storage && storage.get(nextKey));
      dispatch(savedState ? set(savedState) : init());
    }
  };
}

/*
 * Reducers
 */
export function pageScopeReducer(reducer) {
  return (state = {}, action = {}) => {
    switch (action.type) {
      case INIT_PAGE_SCOPE:
        return reducer({}, action);
      case SET_PAGE_SCOPE:
        return action.payload;
      default:
        return reducer(state, action);
    }
  };
}

/*
 * Helpers
 */
function createSessionStorage() {
  if (!availableSessionStorage()) {
    return null;
  }

  const prefix = '@@redux-page-scope/';
  return {
    get(key) {
      try {
        return JSON.parse(window.sessionStorage.getItem(prefix + key));
      } catch (ignore) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.sessionStorage.setItem(prefix + key, JSON.stringify(value));
      } catch (ignore) {
      }
    },
    del(key) {
      try {
        window.sessionStorage.removeItem(prefix + key);
      } catch (ignore) {
      }
    },
  };
}

function availableSessionStorage() {
  if (typeof window !== 'object' || typeof window.sessionStorage !== 'object') {
    return false;
  }

  try {
    const test = '@@redux-page-scope/test';
    window.sessionStorage.setItem(test, test);
    window.sessionStorage.removeItem(test);
    return true;
  } catch (ignore) {
    return false;
  }
}
