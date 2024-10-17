const initialState = {
    startDate: ""
};

const startDateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_START_DATE':
            return {
                ...state,
                startDate: action.payload
            };
        default:
            return state;
    }
};

export default startDateReducer;
