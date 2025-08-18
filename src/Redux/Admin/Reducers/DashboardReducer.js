import { ADMIN_DRAG_ADVERTISEMENT_FAIL, ADMIN_DRAG_ADVERTISEMENT_REQ, ADMIN_DRAG_ADVERTISEMENT_SUCCESS, ADMIN_UPDATE_SALON_INFO_FAIL, ADMIN_UPDATE_SALON_INFO_REQ, ADMIN_UPDATE_SALON_INFO_SUCCESS, GET_ALL_ADVERTISEMENT_FAIL, GET_ALL_ADVERTISEMENT_REQ, GET_ALL_ADVERTISEMENT_SUCCESS, GET_ALL_QUEUELIST_FAIL, GET_ALL_QUEUELIST_REQ, GET_ALL_QUEUELIST_SUCCESS, GET_DASHBOARD_APPOINTMENT_LIST_FAIL, GET_DASHBOARD_APPOINTMENT_LIST_REQ, GET_DASHBOARD_APPOINTMENT_LIST_SUCCESS, SALON_ONLINE_STATUS_FAIL, SALON_ONLINE_STATUS_REQ, SALON_ONLINE_STATUS_SUCCESS } from "../Constants/constants";

import { arrayMove } from '@dnd-kit/sortable';

const getAdvPos = (advertisements, id) => advertisements.findIndex(adv => adv._id === id);

export const getAllAdvertisementReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_ADVERTISEMENT_REQ:
            return {
                ...state,
                resolve: false,
                loading: true
            };
        case GET_ALL_ADVERTISEMENT_SUCCESS:
            return {
                ...state,
                resolve: true,
                loading: false,
                ...action.payload,
            };
        case GET_ALL_ADVERTISEMENT_FAIL:
            return {
                ...state,
                resolve: false,
                loading: false,
                error: action.payload
            };
        case "FILTER_ADVERTISEMENTLIST":

            const filteredAdvertisements = state.advertisements.filter((b) => b._id !== action.payload);

            return {
                ...state,
                advertisements: filteredAdvertisements
            };

        case "AFTER_UPDATE_ADVERTISEMENTLIST":
            const updatedAd = action.payload;

            const index = state.advertisements.findIndex((ad) => ad._id === updatedAd._id);

            if (index === -1) {
                return state;
            }

            // Update the advertisement in the state
            const updatedAdvertisements = [
                ...state.advertisements.slice(0, index), // before the updated advertisement
                updatedAd, // the updated advertisement
                ...state.advertisements.slice(index + 1), // after the updated advertisement
            ];

            return {
                ...state,
                advertisements: updatedAdvertisements
            };

        case "ADD_ADVETISEMENT":

            const newadvertisement = action.payload

            return {
                ...state,
                advertisements: [...state.advertisements, ...newadvertisement]
            }

        case "DRAG_END_ADVERTISEMENTLIST":
            const { active, over } = action.payload; // Assuming payload contains active and over advertisements

            if (!over || active.id === over.id) {
                return state;
            }

            return {
                ...state,
                advertisements: arrayMove(state.advertisements, getAdvPos(state.advertisements, active.id), getAdvPos(state.advertisements, over.id))
            };

        default:
            return state;
    }
};

export const getAllQueueListReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_QUEUELIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_ALL_QUEUELIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                queueList: action.payload.response
            };
        case GET_ALL_QUEUELIST_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };

        case "ADMIN_FILTER_BARBER_QUEUELIST":
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
};

export const getDashboardAppointmentListReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_DASHBOARD_APPOINTMENT_LIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_DASHBOARD_APPOINTMENT_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case GET_DASHBOARD_APPOINTMENT_LIST_FAIL:
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

export const adminSalonStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case SALON_ONLINE_STATUS_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case SALON_ONLINE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case SALON_ONLINE_STATUS_FAIL:
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

export const adminUpdateSalonInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_UPDATE_SALON_INFO_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_UPDATE_SALON_INFO_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_UPDATE_SALON_INFO_FAIL:
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

export const adminDragAdvertisementReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_DRAG_ADVERTISEMENT_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_DRAG_ADVERTISEMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_DRAG_ADVERTISEMENT_FAIL:
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