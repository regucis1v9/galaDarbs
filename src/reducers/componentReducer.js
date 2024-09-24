const initialState = {
    activeComponent: "upload"
};

const activeComponentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_ACTIVE_COMPONENT':
            return {
                ...state,
                activeComponent: action.payload
            };
        default:
            return state;
    }
};

export default activeComponentReducer;
