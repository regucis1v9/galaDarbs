import { combineReducers } from 'redux';
import activeComponentReducer from './componentReducer';
import imageReducer from './imageReducer';

const rootReducer = combineReducers({
  activeComponent: activeComponentReducer,
  images: imageReducer,
});

export default rootReducer;
