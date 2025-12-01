import toast from "react-hot-toast";
import api from "../../api/Api";
import {
  CANCEL_APPOINT_FAIL,
  CANCEL_APPOINT_REQ,
  CANCEL_APPOINT_SUCCESS,
  GET_APPOINTMENT_HISTORY_FAIL,
  GET_APPOINTMENT_HISTORY_REQ,
  GET_APPOINTMENT_HISTORY_SUCCESS,
  GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_FAIL,
  GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_REQ,
  GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_SUCCESS,
  GET_BARBER_APPOINT_LIST_FAIL,
  GET_BARBER_APPOINT_LIST_REQ,
  GET_BARBER_APPOINT_LIST_SUCCESS,
  SERVE_APPOINT_FAIL,
  SERVE_APPOINT_REQ,
  SERVE_APPOINT_SUCCESS,
} from "../Constants/constants";

export const AppointmentAction = (appointdata) => async (dispatch) => {
  try {
    dispatch({ type: GET_BARBER_APPOINT_LIST_REQ });

    const { data } = await api.post(
      "/api/appointments/getAllAppointmentsByBarberIdAndDate",
      appointdata
    );

    dispatch({
      type: GET_BARBER_APPOINT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (error?.response?.status === 500) {
      dispatch({
        type: GET_BARBER_APPOINT_LIST_FAIL,
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
      type: GET_BARBER_APPOINT_LIST_FAIL,
      payload: error?.response?.data,
    });
  }
};

export const CancelAppointmentAction =
  (
    canceldata,
    setCancelAllModalOpen,
    setOpenModal,
    appointmentBarberListData,
    setOpenMobileModal
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: CANCEL_APPOINT_REQ });

      const { data } = await api.post(
        "/api/appointments/barberCancelAppointment",
        canceldata
      );

      dispatch({
        type: CANCEL_APPOINT_SUCCESS,
        payload: data,
      });

      const { data: getAppointmentData } = await api.post(
        "/api/appointments/getAllAppointmentsByBarberIdAndDate",
        {
          salonId: canceldata.salonId,
          barberId: canceldata.barberId,
        }
      );

      dispatch({
        type: GET_BARBER_APPOINT_LIST_SUCCESS,
        payload: getAppointmentData,
      });

      const { data: appointmentBarberList } = await api.post(
        "/api/appointments/getAppointmentListByBarberIdAppointmentDate",
        appointmentBarberListData
      );

      dispatch({
        type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_SUCCESS,
        payload: appointmentBarberList,
      });

      toast.success("Appointment cancel successfully", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      setCancelAllModalOpen(false);
      setOpenModal(false);
      setOpenMobileModal({
        open: false,
        data: {},
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: CANCEL_APPOINT_FAIL,
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
        type: CANCEL_APPOINT_FAIL,
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

export const ServeAppointmentAction =
  (servedata, appointmentBarberListData, setOpenMobileModal, setModalData) =>
  async (dispatch) => {
    try {
      dispatch({ type: SERVE_APPOINT_REQ });

      const { data } = await api.post(
        "/api/appointments/barberServedAppointment",
        servedata
      );

      dispatch({
        type: SERVE_APPOINT_SUCCESS,
        payload: data,
      });

      const { data: getAppointmentData } = await api.post(
        "/api/appointments/getAllAppointmentsByBarberIdAndDate",
        {
          salonId: servedata.salonId,
          barberId: servedata.barberId,
        }
      );

      dispatch({
        type: GET_BARBER_APPOINT_LIST_SUCCESS,
        payload: getAppointmentData,
      });

      const { data: appointmentBarberList } = await api.post(
        "/api/appointments/getAppointmentListByBarberIdAppointmentDate",
        appointmentBarberListData
      );

      dispatch({
        type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_SUCCESS,
        payload: appointmentBarberList,
      });

      toast.success("Appointment serve successfully", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      setOpenMobileModal({
        open: false,
        data: {},
      });
      setModalData({})

    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SERVE_APPOINT_FAIL,
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
        type: SERVE_APPOINT_FAIL,
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

export const getBarberAppointmentHistoryAction =
  (salonId, startDate, endDate, barberId, signal) => async (dispatch) => {
    try {
      dispatch({ type: GET_APPOINTMENT_HISTORY_REQ });

      const { data } = await api.post(
        "/api/appointmentHistory/getAppointmentHistoryByBarberIdSalonId",
        {
          salonId,
          barberId,
          from: startDate,
          to: endDate,
        },
        { signal }
      );

      dispatch({
        type: GET_APPOINTMENT_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: GET_APPOINTMENT_HISTORY_FAIL,
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
          type: GET_APPOINTMENT_HISTORY_FAIL,
          payload: error?.response?.data,
        });
      }
    }
  };

export const AppointmentListBarberAction =
  (appointdata) => async (dispatch) => {
    try {
      dispatch({ type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_REQ });

      const { data } = await api.post(
        "/api/appointments/getAppointmentListByBarberIdAppointmentDate",
        appointdata
      );

      dispatch({
        type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_FAIL,
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
        type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_FAIL,
        payload: error?.response?.data,
      });
    }
  };
