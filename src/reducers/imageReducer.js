import { ADD_IMAGES, REMOVE_IMAGE } from '../actions/imageActions';

const initialState = {
  imageLink:'',
};

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_IMAGES:
      return {
        ...state,
        imageLink: action.payload,
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        images: '',
      };
    default:
      return state;
  }
};

export default imageReducer;
