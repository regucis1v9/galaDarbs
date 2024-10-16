import { SET_BUTTONS_DATA, UPDATE_IMAGE_LINK } from '../actions/imageActions';

const initialState = [];

const imageLinkReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUTTONS_DATA:
      return action.payload; // Set the initial state with buttons data

    case UPDATE_IMAGE_LINK:
      return state.map((button) =>
        button.id === action.payload.id
          ? { ...button, imageLink: action.payload.imageLink }
          : button
      );

    default:
      return state;
  }
};

export default imageLinkReducer;
