const initialState = {
    screens: []
};

const slideshowScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_SLIEDSHOW_SCREENS':
            return {
                ...state,
                screens: action.payload
            };
        default:
            return state;
    }
};

export default slideshowScreenReducer;
