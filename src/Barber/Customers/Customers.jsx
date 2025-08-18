import React, { useEffect, useRef, useState } from 'react'
import style from "./Customers.module.css"
import { CloseIcon, DeleteIcon, EmailIcon, LeftArrow, MessageIcon, Notificationicon, RightArrow, SearchIcon, Settingsicon } from '../../icons'
import Skeleton from 'react-loading-skeleton'
import { barberGetAllCustomerListAction, barberSendCustomerEmailAction, barberSendCustomerMessageAction } from "../../Redux/Barber/Actions/BarberCustomersAction"
import { useDispatch, useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { useNavigate } from 'react-router-dom'
import api from '../../Redux/api/Api'
import { GET_BARBER_ALL_CUSTOMERLIST_REQ, GET_BARBER_ALL_CUSTOMERLIST_SUCCESS } from '../../Redux/Barber/Constants/constants'
import toast from 'react-hot-toast'
import Modal from '@mui/material/Modal';
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';

const CustomerList = () => {

  const currentsalonId = useSelector(state => state.BarberLoggedInMiddleware.barberSalonId)
  const barberProfile = useSelector(state => state.BarberLoggedInMiddleware.entiredata)

  const dispatch = useDispatch()

  const CustomerListControllerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    CustomerListControllerRef.current = controller;

    dispatch(barberGetAllCustomerListAction(currentsalonId, barberProfile?.user[0]?.isApproved, controller.signal));

    return () => {
      if (CustomerListControllerRef.current) {
        CustomerListControllerRef.current.abort();
      }
    };
  }, [dispatch, barberProfile]);

  const barberGetAllCustomerList = useSelector(state => state.barberGetAllCustomerList)

  const {
    loading: barberGetAllCustomerListLoading,
    resolve: barberGetAllCustomerListResolve,
    getAllCustomers: AllCustomerList,
    currentPage,
    totalPages,
  } = barberGetAllCustomerList

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);


  const searchCustomerhandler = async () => {
    setSearchLoading(true);
    try {
      const { data } = await api.get(`/api/customers/getAllCustomersForBarber?salonId=${currentsalonId}&isApproved=${barberProfile?.user[0]?.isApproved}&name=${search}`);
      dispatch({
        type: GET_BARBER_ALL_CUSTOMERLIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchCustomerhandler();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // const [page, setPage] = useState(currentPage);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage)
    }
  }, [currentPage])

  const [checkAllCustomers, setCheckAllCustomers] = useState(false);
  const [checkedCustomers, setCheckedCustomers] = useState({});
  const [checkedEmails, setCheckedEmails] = useState([]);
  const [checkMobileNumbers, setCheckMobileNumber] = useState([]);
  const [checkCustomerNames, setCheckCustomerNames] = useState([]);

  const paginationLeftHandler = async () => {
    if (page > 1) {
      try {
        dispatch({ type: GET_BARBER_ALL_CUSTOMERLIST_REQ })
        const { data } = await api.get(`/api/customers/getAllCustomersForBarber?salonId=${currentsalonId}&isApproved=${barberProfile?.user[0]?.isApproved}&page=${page - 1}`);
        dispatch({
          type: GET_BARBER_ALL_CUSTOMERLIST_SUCCESS,
          payload: data,
        });
        setPage(prevPage => prevPage - 1);
        setCheckAllCustomers(false)
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCheckAllCustomers(false)
      }
    }
  };

  const paginationRightHandler = async () => {
    if (page < totalPages) {
      try {
        dispatch({ type: GET_BARBER_ALL_CUSTOMERLIST_REQ })
        const { data } = await api.get(`/api/customers/getAllCustomersForBarber?salonId=${currentsalonId}&isApproved=${barberProfile?.user[0]?.isApproved}&page=${page + 1}`);
        dispatch({
          type: GET_BARBER_ALL_CUSTOMERLIST_SUCCESS,
          payload: data,
        });
        setPage(prevPage => prevPage + 1);
        setCheckAllCustomers(false)
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCheckAllCustomers(false)
      }
    }
  };

  const customerEmailCheckedHandler = (customer) => {
    const isChecked = !checkedCustomers[customer._id];
    setCheckedCustomers(prevState => ({
      ...prevState,
      [customer._id]: isChecked,
    }));

    if (isChecked) {
      setCheckedEmails(prevEmails => [...prevEmails, customer.email]);
      setCheckMobileNumber(prevMobileNumbers => [...prevMobileNumbers, Number(`${customer?.mobileCountryCode}${customer?.mobileNumber}`)]);
      setCheckCustomerNames(prevNames => [...prevNames, customer.name]);
      setCheckAllCustomers(false)
    } else {
      setCheckedEmails(prevEmails => prevEmails.filter(email => email !== customer.email));
      setCheckMobileNumber(prevMobileNumbers => prevMobileNumbers.filter(mobileNumber => mobileNumber !== Number(`${customer?.mobileCountryCode}${customer?.mobileNumber}`)));
      setCheckCustomerNames(prevNames => prevNames.filter(name => name !== customer.name));
      setCheckAllCustomers(false)
    }
  };

  const checkAllCustomersHandler = (e) => {
    setCheckAllCustomers((prev) => {
      if (!prev) {
        const customerEmails = AllCustomerList.map((c) => c.email);
        const customerMobileNumbers = AllCustomerList.map((c) => Number(`${c?.mobileCountryCode}${c?.mobileNumber}`));
        const customerNames = AllCustomerList.map((c) => c.name);
        const allCheckedCustomers = AllCustomerList.reduce((acc, customer) => {
          acc[customer._id] = true;
          return acc;
        }, {});
        setCheckedEmails(customerEmails);
        setCheckMobileNumber(customerMobileNumbers);
        setCheckCustomerNames(customerNames);
        setCheckedCustomers(allCheckedCustomers);
      } else {
        setCheckedEmails([]);
        setCheckMobileNumber([]);
        setCheckCustomerNames([]);
        setCheckedCustomers({});
      }

      return !prev;
    });
  };

  const navigate = useNavigate();

  const [openBarberEmail, setOpenBarberEmail] = useState(false)

  const sendEmailNavigate = () => {
    if (checkedEmails.length > 0) {
      // navigate('/barber-customer/send-email', { state: checkedEmails });

      setOpenBarberEmail(true)
    } else {
      toast.error("Atleast one customer needed", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

  };

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const sendMailHandler = () => {
    const maildata = {
      subject,
      message,
      role: "Barber",
      recipientEmails: checkedEmails
    }
    // console.log(maildata)
    dispatch(barberSendCustomerEmailAction(maildata, setSubject, setMessage, setOpenBarberEmail))
  }

  const barberSendCustomerEmail = useSelector(state => state.barberSendCustomerEmail)

  const {
    loading: barberSendCustomerEmailLoading
  } = barberSendCustomerEmail

  const [openBarberMessage, setOpenBarberMessage] = useState(false)
  const [barberMessage, setBarberMessage] = useState("")

  const sendMessageNavigate = () => {
    if (checkMobileNumbers.length > 0) {
      // navigate('/barber-customer/send-message', {
      //   state: {
      //     checkMobileNumbers,
      //     checkCustomerNames,
      //   },
      // });

      setOpenBarberMessage(true)
    } else {
      toast.error("Please select a customer", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

  };


  const sendMessageHandler = () => {
    const smsdata = {
      smsBody: barberMessage,
      numbers: checkMobileNumbers
    }
    // console.log(smsdata)
    dispatch(barberSendCustomerMessageAction(smsdata, setMessage, setOpenBarberMessage))

  }

  const barberSendCustomerMessage = useSelector(state => state.barberSendCustomerMessage)

  const {
    loading: barberSendCustomerMessageLoading
  } = barberSendCustomerMessage

  return (
    <div className={`${style.customer_wrapper} ${darkmodeOn && style.dark}`}>
      <div>
        <p>Customer List</p>

        <div>
          <div className={`${style.customer_search} ${darkmodeOn && style.dark}`}>
            <input
              type="text"
              placeholder='Search Customer'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div><SearchIcon /></div>
          </div>

          <button className={`${style.customer_send_btn} ${darkmodeOn && style.dark}`} onClick={sendEmailNavigate} title='Email'>
            <div><EmailIcon /></div>
          </button>


          <Modal
            open={openBarberEmail}
            onClose={() => setOpenBarberEmail(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={style.modal_container}>
              <div>
                <p>Send Email</p>
                <button onClick={() => setOpenBarberEmail(false)}><CloseIcon /></button>
              </div>

              <div className={style.modal_content_container}>
                <div>
                  <p>From</p>
                  <input
                    type="text"
                    value={"support@iqueuebarbers.com"}
                    readOnly
                  />
                </div>

                <div>
                  <p>To</p>
                  <input type="text"
                    value={
                      checkedEmails?.map((e) => " " + e)
                    }
                  />
                </div>

                <div>
                  <p>Subject</p>
                  <input
                    type="text"
                    placeholder='Enter Subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>


                <div>
                  <p>Message</p>
                  <textarea
                    type="text"
                    placeholder='Enter Message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                {
                  barberSendCustomerEmailLoading ?
                    <button className={style.barber_send_btn}><ButtonLoader /></button> :
                    <button onClick={sendMailHandler} disabled={barberSendCustomerEmailLoading} className={style.barber_send_btn}>Send</button>
                }
              </div>
            </div>
          </Modal>

          <button className={`${style.customer_send_btn} ${darkmodeOn && style.dark}`} onClick={sendMessageNavigate} title='Message'>
            <div><MessageIcon /></div>
          </button>


          <Modal
            open={openBarberMessage}
            onClose={() => setOpenBarberMessage(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={style.modal_container}>
              <div>
                <p>Send Message</p>
                <button onClick={() => setOpenBarberMessage(false)}><CloseIcon /></button>
              </div>

              <div className={style.modal_content_container}>
                <div>
                  <p>From</p>
                  <input
                    type="text"
                    value={"iqueuebarbers"}
                    readOnly
                  />
                </div>

                <div>
                  <p>To</p>
                  <input type="text" value={
                    checkCustomerNames?.map((e) => " " + e)
                  } />
                </div>

                <div>
                  <p>Message</p>
                  <textarea
                    type="text"
                    placeholder='Enter Message'
                    value={barberMessage}
                    onChange={(e) => setBarberMessage(e.target.value)}
                  ></textarea>
                </div>

                {
                  barberSendCustomerMessageLoading ?
                    <button className={style.barber_send_btn}><ButtonLoader /></button> :
                    <button onClick={sendMessageHandler} disabled={barberSendCustomerMessageLoading} className={style.barber_send_btn}>Send</button>
                }
              </div>
            </div>
          </Modal>

        </div>

      </div>

      <div className={`${style.customer_content_wrapper} ${darkmodeOn && style.dark}`}>
        {barberGetAllCustomerListLoading || searchLoading ? (
          <div className={style.customer_content_body}>
            <Skeleton
              count={6}
              height={'6rem'}
              style={{ marginBottom: '1rem' }}
              baseColor={darkmodeOn ? 'var(--darkmode-loader-bg-color)' : 'var(--light-loader-bg-color)'}
              highlightColor={darkmodeOn ? 'var(--darkmode-loader-highlight-color)' : 'var(--light-loader-highlight-color)'}
            />
          </div>
        ) : barberGetAllCustomerListResolve && AllCustomerList?.length > 0 ? (
          <div className={`${style.customer_content_body} ${darkmodeOn && style.dark}`}>
            <div>
              <div>
                <input
                  type="checkbox"
                  onChange={checkAllCustomersHandler}
                  checked={checkAllCustomers}
                />
              </div>
              <p>Name</p>
              <p>Email</p>
              <p>Gender</p>
              <p>Mobile No.</p>
            </div>

            {AllCustomerList.map((s, index) => (
              <div key={s._id}
                style={{
                  borderBottom: AllCustomerList.length - 1 === index && "none"
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={checkedCustomers[s._id] || false}
                    onChange={() => customerEmailCheckedHandler(s)}
                  />
                </div>
                <p>{s?.name.length > 18 ? `${s.name.slice(0, 18)}...` : s.name}</p>
                <p>{s?.email.length > 18 ? `${s.email.slice(0, 18)}...` : s.email}</p>
                <p>{s?.gender}</p>
                <p>{s?.mobileNumber}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${style.customer_content_body_error} ${darkmodeOn && style.dark}`}>
            <p>Customers not available</p>
          </div>
        )}
      </div>

      <div className={style.customer_pagination_wrapper}>
        <div>
          <div onClick={paginationLeftHandler}><LeftArrow /></div>
          <div onClick={paginationRightHandler} disabled={page === totalPages}><RightArrow /></div>
        </div>
      </div>
    </div>
  )
}

export default CustomerList