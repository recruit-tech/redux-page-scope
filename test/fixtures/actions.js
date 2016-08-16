import { LOCATION_CHANGE } from 'react-router-redux';

export function add(value) {
  return {
    type: 'ADD',
    payload: value,
  };
}

export function locationChange(action, key, pathname) {
  return {
    type: LOCATION_CHANGE,
    payload: {
      action,
      key,
      pathname,
    },
  };
}
