// Action types
export const SET_BUTTONS_DATA = 'SET_BUTTONS_DATA';
export const UPDATE_IMAGE_LINK = 'UPDATE_IMAGE_LINK';
export const UPDATE_IMAGE_DESCRIPTION = 'UPDATE_IMAGE_DESCRIPTION';
export const UPDATE_TEXT_COLOR = 'UPDATE_TEXT_COLOR'; // New action type for text color
export const UPDATE_BG_COLOR = 'UPDATE_BG_COLOR'; // New action type for background color
export const UPDATE_TEXT_POSITION = 'UPDATE_TEXT_POSITION'; // New action type for text position

// Action creators
export const setButtonsData = (buttonsData) => ({
  type: SET_BUTTONS_DATA,
  payload: buttonsData,
});

export const updateImageLink = (id, imageLink) => ({
  type: UPDATE_IMAGE_LINK,
  payload: { id, imageLink },
});

export const updateImageDescription = (id, description) => ({
  type: UPDATE_IMAGE_DESCRIPTION,
  payload: { id, description },
});

export const updateTextColor = (id, textColor) => ({
  type: UPDATE_TEXT_COLOR,
  payload: { id, textColor }, // Pass the ID and new text color
});

export const updateBgColor = (id, bgColor) => ({
  type: UPDATE_BG_COLOR,
  payload: { id, bgColor }, // Pass the ID and new background color
});
export const updateTextPosition = (id, textPosition) => ({
  type: UPDATE_TEXT_POSITION,
  payload: { id, textPosition }, // Pass the ID and new text position
});
