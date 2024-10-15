export const ADD_IMAGES = 'ADD_IMAGES';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const addImages = (imageLink) => ({
  type: ADD_IMAGES,
  payload: imageLink,
});

export const removeImage = (imageLink) => ({
  type: REMOVE_IMAGE,
  payload: imageLink,
});
