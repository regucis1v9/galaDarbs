import { combineReducers } from 'redux';
import activeComponentReducer from './componentReducer';
import imageLinkReducer from './imageReducer';
import slideshowScreenReducer from './slideshowScreenRecuer';
import startDateReducer from './startDateReducer';
import endDateReducer from './endDateReducer';

const rootReducer = combineReducers({
  activeComponent: activeComponentReducer,
  imageLinks: imageLinkReducer,
  screens: slideshowScreenReducer,
  startDate: startDateReducer,
  endDate: endDateReducer
});

export default rootReducer;
