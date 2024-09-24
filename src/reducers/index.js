import { combineReducers } from 'redux';
import activeComponentReducer from './componentReducer';

const rootReducer = combineReducers({
  activeComponent: activeComponentReducer,
});

export default rootReducer;
