import {
  SET_BUTTONS_DATA,
  UPDATE_IMAGE_LINK,
  UPDATE_IMAGE_DESCRIPTION,
  UPDATE_TEXT_COLOR, // New import for text color
  UPDATE_BG_COLOR, // New import for background color
  UPDATE_TEXT_POSITION, // New import for text position
} from '../actions/imageActions';

const initialState = [];

const imageLinkReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUTTONS_DATA:
      return Array.isArray(action.payload) ? action.payload : state;

    case UPDATE_IMAGE_LINK:
      return state.map((button) =>
        button.id === action.payload.id
          ? { ...button, imageLink: action.payload.imageLink }
          : button
      );

    case UPDATE_IMAGE_DESCRIPTION:
      return state.map((button) =>
        button.id === action.payload.id
          ? { ...button, description: action.payload.description }
          : button
      );

    case UPDATE_TEXT_COLOR:
      return state.map((button) =>
        button.id === action.payload.id
          ? { ...button, textColor: action.payload.textColor } // Update text color
          : button
      );

    case UPDATE_BG_COLOR:
      return state.map((button) =>
        button.id === action.payload.id
          ? { ...button, bgColor: action.payload.bgColor } // Update background color
          : button
      );

    case UPDATE_TEXT_POSITION: // New case for updating text position
      return state.map((button) =>
        button.id === action.payload.id
          ? { ...button, textPosition: action.payload.textPosition } // Update text position
          : button
      );

    default:
      return state;
  }
};

export default imageLinkReducer;
