const initialState = {
    endDate: ""
};

const endDateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_END_DATE':
            return {
                ...state,
                endDate: action.payload
            };
        default:
            return state;
    }
};

export default endDateReducer;
