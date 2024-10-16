// Action types
export const SET_BUTTONS_DATA = 'SET_BUTTONS_DATA';
export const UPDATE_IMAGE_LINK = 'UPDATE_IMAGE_LINK';

// Action creators
export const setButtonsData = (buttonsData) => ({
  type: SET_BUTTONS_DATA,
  payload: buttonsData,
});

export const updateImageLink = (id, imageLink) => ({
  type: UPDATE_IMAGE_LINK,
  payload: { id, imageLink },
});
