import { GET_QUEUE_HISTORY_FAIL, GET_QUEUE_HISTORY_REQ, GET_QUEUE_HISTORY_SUCCESS, GET_QUEUELIST_BARBERID_FAIL, GET_QUEUELIST_BARBERID_REQ, GET_QUEUELIST_BARBERID_SUCCESS } from "../Constants/constants";

export const getBarberQueueListReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_QUEUELIST_BARBERID_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_QUEUELIST_BARBERID_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                queueList: action.payload.queueList
            };
        case GET_QUEUELIST_BARBERID_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };
        case "FILTER_BARBER_QUEUELIST":
            const id = action.payload;
            const filteredQueueList = state.queueList?.filter((q) => q._id !== id);
            return {
                ...state,
                loading: false,
                resolve: true,
                queueList: filteredQueueList
            };
        default:
            return state;
    }
}


export const getBarberQueueListHistoryReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_QUEUE_HISTORY_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_QUEUE_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                queueListHistory: action.payload.response
            };
        case GET_QUEUE_HISTORY_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };
        default:
            return state;
    }
}