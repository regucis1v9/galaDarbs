import { combineReducers } from 'redux';
import activeComponentReducer from './componentReducer';
import imageLinkReducer from './imageReducer';

const rootReducer = combineReducers({
  activeComponent: activeComponentReducer,
  imageLinks: imageLinkReducer,
});

export default rootReducer;
