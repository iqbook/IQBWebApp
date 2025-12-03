import toast from "react-hot-toast";
import api from "../../api/Api";
import {
  BARBER_BARBER_SERVED_QUEUE_FAIL,
  BARBER_BARBER_SERVED_QUEUE_REQ,
  BARBER_BARBER_SERVED_QUEUE_SUCCESS,
  BARBER_CANCEL_QUEUE_FAIL,
  BARBER_CANCEL_QUEUE_REQ,
  BARBER_CANCEL_QUEUE_SUCCESS,
  GET_ALL_SALON_SERVICES_FAIL,
  GET_ALL_SALON_SERVICES_REQ,
  GET_ALL_SALON_SERVICES_SUCCESS,
  GET_QUEUE_HISTORY_FAIL,
  GET_QUEUE_HISTORY_REQ,
  GET_QUEUE_HISTORY_SUCCESS,
  GET_QUEUELIST_BARBERID_FAIL,
  GET_QUEUELIST_BARBERID_REQ,
  GET_QUEUELIST_BARBERID_SUCCESS,
} from "../Constants/constants";

export const getBarberQueueListAction =
  (salonId, barberId, signal) => async (dispatch) => {
    try {
      dispatch({ type: GET_QUEUELIST_BARBERID_REQ });

      const { data } = await api.get(
        `/api/queue/getQlistByBarberId?salonId=${salonId}&barberId=${barberId}`,
        { signal }
      );

      dispatch({
        type: GET_QUEUELIST_BARBERID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: GET_QUEUELIST_BARBERID_FAIL,
          payload: "Something went wrong !",
        });

        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        return;
      }

      if (error.name !== "CanceledError") {
        dispatch({
          type: GET_QUEUELIST_BARBERID_FAIL,
          payload: error?.response?.data,
        });
      }
    }
  };

export const barberServeQueueAction =
  (
    barberqueuedata,
    salonId,
    barberId,
    setBarberServeLoading,
    setOpenModal,
    setOpenConfirmationQueueModal
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: BARBER_BARBER_SERVED_QUEUE_REQ });
      setBarberServeLoading(true);

      const { data } = await api.post(
        "/api/queue/barberServedQueue",
        barberqueuedata
      );

      dispatch({
        type: BARBER_BARBER_SERVED_QUEUE_SUCCESS,
        payload: data,
      });

      toast.success("Customer serve successfully", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      setBarberServeLoading(false);
      setOpenModal({
        open: false,
        data: {},
      });

      const { data: queuelistdata } = await api.get(
        `/api/queue/getQlistByBarberId?salonId=${salonId}&barberId=${barberId}`
      );

      dispatch({
        type: GET_QUEUELIST_BARBERID_SUCCESS,
        payload: queuelistdata,
      });

      setOpenConfirmationQueueModal({
        data: null,
        open: false,
      });
    } catch (error) {
      setBarberServeLoading(false);

      if (error?.response?.status === 500) {
        dispatch({
          type: BARBER_BARBER_SERVED_QUEUE_FAIL,
          payload: "Something went wrong !",
        });

        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        return;
      }

      dispatch({
        type: BARBER_BARBER_SERVED_QUEUE_FAIL,
        payload: error?.response?.data,
      });

      toast.error(error?.response?.data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

export const barberCancelQueueAction =
  (canceldata, salonId, barberId, setBarberCancelLoading, setOpenModal, setOpenConfirmationCancelQueueModal) =>
  async (dispatch) => {
    try {
      dispatch({ type: BARBER_CANCEL_QUEUE_REQ });
      setBarberCancelLoading(true);

      const { data } = await api.post(`/api/queue/cancelQ`, canceldata);

      dispatch({
        type: BARBER_CANCEL_QUEUE_SUCCESS,
        payload: data,
      });

      toast.success("Customer cancel successfully", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      setBarberCancelLoading(false);
      setOpenModal({
        open: false,
        data: {},
      });

      const { data: queuelistdata } = await api.get(
        `/api/queue/getQlistByBarberId?salonId=${salonId}&barberId=${barberId}`
      );

      dispatch({
        type: GET_QUEUELIST_BARBERID_SUCCESS,
        payload: queuelistdata,
      });

      setOpenConfirmationCancelQueueModal({
        data: null,
        open: false
      })
    } catch (error) {
      setBarberCancelLoading(false);

      if (error?.response?.status === 500) {
        dispatch({
          type: BARBER_CANCEL_QUEUE_FAIL,
          payload: "Something went wrong !",
        });

        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        return;
      }

      dispatch({
        type: BARBER_CANCEL_QUEUE_FAIL,
        payload: error?.response?.data,
      });

      toast.error(error?.response?.data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

export const getBarberQueueListHistoryAction =
  (salonId, barberId, signal) => async (dispatch) => {
    try {
      dispatch({ type: GET_QUEUE_HISTORY_REQ });

      const { data } = await api.post(
        "/api/queueHistory/getQueueHistoryBySalonIdBarberId",
        {
          salonId,
          barberId,
        },
        { signal }
      );

      dispatch({
        type: GET_QUEUE_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: GET_QUEUE_HISTORY_FAIL,
          payload: "Something went wrong !",
        });

        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        return;
      }

      if (error.name !== "CanceledError") {
        dispatch({
          type: GET_QUEUE_HISTORY_FAIL,
          payload: error?.response?.data,
        });
      }
    }
  };

export const getAllSalonServicesBarberAction =
  (salonId) => async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_SALON_SERVICES_REQ });

      const { data } = await api.get(
        `/api/barber/getAllSalonServicesForBarber?salonId=${salonId}`
      );

      dispatch({
        type: GET_ALL_SALON_SERVICES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: GET_ALL_SALON_SERVICES_FAIL,
          payload: "Something went wrong !",
        });

        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        return;
      }

      if (error.name !== "CanceledError") {
        dispatch({
          type: GET_ALL_SALON_SERVICES_FAIL,
          payload: error?.response?.data,
        });
      }
    }
  };
