import React, { useEffect, useRef, useState } from 'react'
import style from "./EditProfile.module.css"
import { AddIcon, CameraIcon, CheckIcon, CloseIcon, ConnectSalonIcon, ContactTel, DeleteIcon, DropdownIcon, EmailIcon, OtpEmailIcon, SalonIcon } from '../../newicons'
import { PhoneInput } from 'react-international-phone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../Redux/api/Api';
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';
import toast from 'react-hot-toast';
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';

import { barberSendVerifyEmailAction, barberSendVerifyMobileAction, barberUpdatePasswordAction, barberUpdateProfileAction, barberVerifiedEmailStatusAction, barberVerifiedMobileStatusAction } from "../../Redux/Barber/Actions/BarberProfileAction"
import { BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS } from '../../Redux/Barber/Constants/constants';
import { ClockIcon, CrownIcon, Eyevisible, Notvisibleeye, OtpMessageIcon } from '../../icons'

import { PhoneNumberUtil } from 'google-libphonenumber';


import { ClickAwayListener, Modal, Skeleton } from '@mui/material';
import { getAllSalonServicesBarberAction } from '../../Redux/Barber/Actions/BarberQueueAction';
import { getCurrentDate } from '../../utils/Date';
import Calendar from 'react-calendar';
import { ddmmformatDate } from '../../../utils/ddmmformatDate'
import { useBarberGlobal } from '../../context/Barber/GlobalContext';

const EditProfile = () => {

    const { editServiceModal, setEditServiceModal } = useBarberGlobal();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const salonId = useSelector(state => state.BarberLoggedInMiddleware.barberSalonId)
    const barberProfile = useSelector(state => state.BarberLoggedInMiddleware.entiredata.user[0])

    const [changeEmailVerifiedState, setChangeEmailVerifiedState] = useState(barberProfile?.emailVerified)
    const [changeMobileVerifiedState, setChangeMobileVerifiedState] = useState(barberProfile?.mobileVerified)

    const [name, setName] = useState(barberProfile?.name)
    const [dateOfBirth, setDateofBirth] = useState(barberProfile?.dateOfBirth?.split('T')[0])

    const fileInputRef = useRef(null);

    const handleSalonLogoButtonClick = () => {
        fileInputRef.current.click();
    };


    const [uploadpicLoader, setUploadpicLoader] = useState(false)

    const handleProfileFileInputChange = async (e) => {
        const uploadImage = e.target.files[0]; // Get the uploaded file

        const allowedTypes = ["image/jpeg", "image/webp", "image/png"];
        if (!allowedTypes.includes(uploadImage.type)) {
            toast.error("Please upload only valid image files (JPEG, WebP, PNG).", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        const maxSizeInBytes = 2 * 1024 * 1024;
        if (uploadImage.size > maxSizeInBytes) {
            toast.error("File size must be lower than 2mb", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        const formData = new FormData();

        formData.append('email', barberProfile?.email);
        formData.append('profile', uploadImage);
        formData.append('salonId', barberProfile?.salonId)

        try {
            setUploadpicLoader(true)
            const imageResponse = await api.post('/api/barber/uploadBarberProfilePicture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadpicLoader(false)

            // setProfilepic(imageResponse?.data?.adminImage?.profile[0]?.url)

            const { data: barberloggedindata } = await api.get('/api/barber/barberloggedin');

            dispatch({
                type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
                payload: barberloggedindata
            })

            toast.success("Profile upload successfully", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

        } catch (error) {
            setUploadpicLoader(false)

            if (error?.response?.status === 500) {

                toast.error("Something went wrong !", {
                    duration: 3000,
                    style: {
                        fontSize: "var(--font-size-2)",
                        borderRadius: '0.3rem',
                        background: '#333',
                        color: '#fff',
                    },
                });

                return;
            }

            toast.error(error?.response?.data?.message, {
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


    const mobileEmailTimeoutRef = useRef(30);
    const LOCAL_EMAIL_STORAGE_KEY = "lastEmailVerificationTime";

    const sendVerificationEmail = () => {
        if (!changeEmailVerifiedState) {
            const lastCallTime = localStorage.getItem(LOCAL_EMAIL_STORAGE_KEY);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            if (lastCallTime && currentTime - lastCallTime < mobileEmailTimeoutRef.current) {
                const timeLeft = mobileEmailTimeoutRef.current - (currentTime - lastCallTime);
                alert(`Please wait ${timeLeft} seconds before resending.`);
                return;
            }

            // Save the current timestamp to localStorage
            localStorage.setItem(LOCAL_EMAIL_STORAGE_KEY, currentTime);

            dispatch(barberSendVerifyEmailAction(barberProfile?.email, setOpenEmailModal))
        }
    };


    const [otp, setOtp] = useState(["", "", "", ""]);
    const otpinputRef = useRef([]);

    const handleOtpInputChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;

        if (value && index < otp.length - 1) {
            otpinputRef.current[index + 1].focus();
        }

        setOtp(newOtp);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && index > 0 && !otp[index]) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            otpinputRef.current[index - 1].focus();
            setOtp(newOtp);
        }

        if (e.key === "Enter") {
            verifyEmailStatusClicked();
        }
    };


    const mobileTimeoutRef = useRef(30);
    const LOCAL_STORAGE_KEY = "lastMobileVerificationTime";

    const sendVerificationMobile = () => {
        if (!changeMobileVerifiedState) {
            const lastCallTime = localStorage.getItem(LOCAL_STORAGE_KEY);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            if (lastCallTime && currentTime - lastCallTime < mobileTimeoutRef.current) {
                const timeLeft = mobileTimeoutRef.current - (currentTime - lastCallTime);
                alert(`Please wait ${timeLeft} seconds before resending.`);
                return;
            }

            // Save the current timestamp to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, currentTime);

            dispatch(barberSendVerifyMobileAction(barberProfile?.email, setOpenMobileModal))
        }
    };

    const [mobileotp, setMobileOtp] = useState(["", "", "", ""]);
    const mobileotpinputRef = useRef([]);

    const handleMobileOtpInputChange = (index, value) => {
        const newOtp = [...mobileotp];
        newOtp[index] = value;

        if (value && index < mobileotp.length - 1) {
            mobileotpinputRef.current[index + 1].focus();
        }

        setMobileOtp(newOtp);
    };

    const handleMobileKeyDown = (index, e) => {
        if (e.key === "Backspace" && index > 0 && !mobileotp[index]) {
            const newOtp = [...mobileotp];
            newOtp[index - 1] = "";
            mobileotpinputRef.current[index - 1].focus();
            setMobileOtp(newOtp);
        }

        if (e.key === "Enter") {
            verifyMobileStatusClicked();
        }
    };

    const [gender, setGender] = useState(barberProfile?.gender)
    const [genderDrop, setGenderDrop] = useState(false)

    const genderDropHandler = () => {
        setGenderDrop((prev) => !prev)
    }

    const setGenderHandler = (value) => {
        setGender(value)
        setGenderDrop(false)
    }

    const [mobileNumber, setMobileNumber] = useState(`${barberProfile?.mobileCountryCode}${barberProfile?.mobileNumber?.toString()}`)

    const [countryCode, setCountryCode] = useState(barberProfile?.mobileCountryCode)

    const [invalidnumber, setInvalidNumber] = useState(false)


    const [nameError, setNameError] = useState("")
    const [invalidNumberError, setInvalidNumberError] = useState("")

    const updateBarberProfile = () => {

        if (name.length === 0 || name.length > 20) {
            toast.error("Name must be between 1 to 20 characters", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setNameError("Name must be between 1 to 20 characters");
        }

        if (invalidnumber) {
            toast.error("Invalid Number", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return setInvalidNumberError("Invalid Number")
        }


        const profiledata = {
            email: barberProfile?.email,
            dateOfBirth,
            mobileNumber: Number(mobileNumber),
            countryCode: Number(countryCode),
            name,
            gender,
            password,
            barberServices: currentBarberServices
        }

        dispatch(barberUpdateProfileAction(profiledata, navigate))
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            updateBarberProfile();
        }
    };

    const barberUpdateProfile = useSelector(state => state.barberUpdateProfile)

    const {
        loading: barberUpdateProfileLoading,
        resolve: barberUpdateProfileResolve,
    } = barberUpdateProfile

    const verifyEmailStatusClicked = () => {
        const currentOtp = otp?.join("")

        dispatch(barberVerifiedEmailStatusAction(barberProfile?.email, currentOtp, setOpenEmailModal, setOtp, setChangeEmailVerifiedState))
    }

    const verifyMobileStatusClicked = () => {
        const currentOtp = mobileotp?.join("")

        dispatch(barberVerifiedMobileStatusAction(barberProfile?.email, currentOtp, setOpenMobileModal, setMobileOtp, setChangeMobileVerifiedState))
    }

    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [oldPasswordError, setOldPasswordError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [notMatchError, setNotMatchError] = useState("")

    const updatePasswordHandler = () => {

        if (!oldPassword) {
            toast.error("Please enter password", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setOldPasswordError("Please enter old password")
        }

        if (oldPassword.length < 8) {
            toast.error("Password length must be 8 charecters", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setOldPasswordError("Old password length must be 8 charecters")
        }

        if (!password) {
            toast.error("Please enter password", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setPasswordError("Please enter new password")
        }

        if (password.length < 8) {
            toast.error("Password length must be 8 charecters", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setPasswordError("New password length must be 8 charecters")
        }

        if (!confirmPassword) {
            toast.error("Please enter confirm password", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setConfirmPasswordError("Please enter confirm password")
        }

        if (confirmPassword.length < 8) {
            toast.error("Confirm password length must be 8 charecters", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setConfirmPasswordError("Confirm password length must be 8 charecters")
        }

        if (password !== confirmPassword) {
            toast.error("Password and confirm password do not match", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setNotMatchError("Password and confirm password do not match");
        }

        const profiledata = {
            email: barberProfile?.email,
            password,
            oldPassword
        }

        dispatch(barberUpdatePasswordAction(profiledata, navigate))
    }

    const handleKeyPressPasswordHandler = (e) => {
        if (e.key === "Enter") {
            updatePasswordHandler();
        }
    };

    const barberUpdatePassword = useSelector(state => state.barberUpdatePassword)

    const {
        loading: barberUpdatePasswordLoading
    } = barberUpdatePassword

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    const [seeOldPassword, setSeeOldPassword] = useState(false)
    const [seePassword, setSeePassword] = useState(false)
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false)

    const phoneUtil = PhoneNumberUtil.getInstance();

    const isPhoneValid = (phone) => {
        try {
            return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
        } catch (error) {
            return false;
        }
    };

    const [countryflag, setCountryFlag] = useState("gb")

    const handlePhoneChange = (phone, meta) => {
        setInvalidNumberError("")
        const { country, inputValue } = meta;

        const isValid = isPhoneValid(phone);

        if (isValid) {
            setMobileNumber(phone)
            setCountryCode(country?.dialCode)
            setCountryFlag(country?.iso2)
            setInvalidNumber(false)
        } else {
            setInvalidNumber(true)
        }
    };

    const [openPasswordModal, setOpenPasswordModal] = useState(false)
    const [openMobileModal, setOpenMobileModal] = useState(false)
    const [openEmailModal, setOpenEmailModal] = useState(false)

    useEffect(() => {
        if (barberProfile && salonId !== 0) {
            dispatch(getAllSalonServicesBarberAction(barberProfile?.salonId))
        }
    }, [barberProfile, salonId, dispatch])

    const getAllSalonServicesBarber = useSelector(state => state.getAllSalonServicesBarber)

    const {
        loading: getAllSalonServicesBarberLoading,
        resolve: getAllSalonServicesBarberResolve,
        response: getAllSalonServicesBarberData
    } = getAllSalonServicesBarber

    useEffect(() => {
        if (getAllSalonServicesBarberData) {
            setAllSalonServices(getAllSalonServicesBarberData?.response?.services)
        }
    }, [getAllSalonServicesBarberData])


    const [AllSalonServices, setAllSalonServices] = useState([])

    const [currentBarberServices, setCurrentBarberServices] = useState(barberProfile?.barberServices)


    // Choose service handler
    const chooseServiceHandler = (service) => {
        const originalService = currentBarberServices.includes(service);

        if (!originalService) {
            setCurrentBarberServices([...currentBarberServices, { ...service, barberServiceEWT: service.serviceEWT }]);
        }

    };

    // Delete service handler
    const deleteServiceHandler = (service) => {
        const originalService = getAllSalonServicesBarberData?.response?.services.find((s) => s.serviceId === service.serviceId);

        if (originalService) {
            setCurrentBarberServices(currentBarberServices.filter((f) => f.serviceId !== service.serviceId));

            setAllSalonServices(AllSalonServices.map((ser) =>
                ser.serviceId === service.serviceId ? { ...ser, serviceEWT: originalService.serviceEWT } : ser
            ));
        }
    };

    const handleonChange = (e, service) => {
        const newValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only digits

        const numericValue = newValue === '' ? '' : Number(newValue);

        if (currentBarberServices.find((c) => c.serviceId === service.serviceId)) {
            setCurrentBarberServices(currentBarberServices.map((ser) =>
                ser.serviceId === service.serviceId ? { ...ser, barberServiceEWT: numericValue } : ser
            ));
        } else {
            setAllSalonServices(getAllSalonServicesBarberData?.response?.services.map((ser) =>
                ser.serviceId === service.serviceId ? { ...ser, serviceEWT: numericValue } : ser
            ));
        }
    };


    useEffect(() => {
        const phoneInput = document.querySelector(
            '.react-international-phone-input-container .react-international-phone-input'
        );

        if (phoneInput) {
            // phoneInput.style.color = darkmodeOn ? 'var(--light-color-4)' : 'var(--light-color-2)';
            phoneInput.style.color = "var(--text-primary)"
        }
    }, [darkmodeOn]);


    //Calender Logic

    const [openCalender, setOpenCalender] = useState(false)

    const handleClickAway = () => {
        setOpenCalender(false);
    };

    const [value, onChange] = useState(new Date());

    const convertDateToYYYYMMDD = (dateInput) => {
        const date = new Date(dateInput);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onChangeHandler = (dateInput) => {
        const formattedDate = convertDateToYYYYMMDD(dateInput);
        onChange(formattedDate)
        setDateofBirth(formattedDate)
        setOpenCalender(false)
    }

    const [mobileValue, setMobileValue] = useState(false);

    useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth <= 576) {
                setMobileValue(true);
            } else {
                setMobileValue(false);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let progress = 0;
    if (barberProfile?.name) progress = 25;
    if (barberProfile?.name && barberProfile?.mobileNumber) progress = 50;
    if (barberProfile?.name && barberProfile?.mobileNumber && barberProfile?.dateOfBirth) progress = 75;
    if (barberProfile?.name && barberProfile?.mobileNumber && barberProfile?.dateOfBirth && barberProfile?.gender) progress = 100;

    const phoneRef = useRef()

    useEffect(() => {
        if (phoneRef.current) {
            phoneRef.current.style.backgroundColor = "var(--input-bg-color)";
        }
    }, [])


    return (
        <section className={`${style.section}`}>
            <div>
                <h2>Profile</h2>
                {
                    salonId === 0 ? (<div></div>) : <button onClick={() => setEditServiceModal(true)}>Edit services</button>
                }
            </div>

            <Modal
                open={editServiceModal}
                onClose={() => setEditServiceModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={`${style.edit_modal_container} ${darkmodeOn && style.dark}`}>
                    <div>
                        <p>Edit Services</p>
                        <button onClick={() => setEditServiceModal(false)}><CloseIcon /></button>
                    </div>

                    {
                        getAllSalonServicesBarberLoading ? (
                            <main className={`${style.edit_modal_content_container_loading} ${darkmodeOn && style.dark}`}>
                                <Skeleton variant="rectangular" width={"100%"} height={"16rem"} style={{ borderRadius: "var(--list-wrapper-border-radius)" }} />
                                <Skeleton variant="rectangular" width={"100%"} height={"16rem"} style={{ borderRadius: "var(--list-wrapper-border-radius)" }} />
                            </main>
                        ) :
                            getAllSalonServicesBarberData?.response?.services?.length > 0 ?
                                (<main className={`${style.edit_modal_content_container} ${darkmodeOn && style.dark}`}>

                                    {AllSalonServices?.map((s) => (
                                        <div key={s.serviceId} className={style.service_item}>
                                            <div>
                                                <div>
                                                    <div>
                                                        <img src={s?.serviceIcon?.url} alt={s?.serviceName} />

                                                        {s.vipService ? <span><CrownIcon /></span> : null}
                                                    </div>
                                                    <div>
                                                        <p>{s?.serviceName}</p>
                                                        <p>{s?.vipService ? "VIP" : "Regular"}</p>
                                                        <p>{s?.serviceDesc}</p>
                                                    </div>
                                                </div>
                                                {currentBarberServices.find((c) => c.serviceId === s.serviceId) ? (
                                                    <button
                                                        style={{
                                                            background: "#450a0a",
                                                        }}
                                                        onClick={() => deleteServiceHandler(s)}
                                                    >Delete</button>
                                                ) : (
                                                    <button
                                                        style={{
                                                            background: "#052e16",
                                                        }}
                                                        onClick={() => chooseServiceHandler(s)}
                                                    >Add</button>
                                                )}

                                            </div>
                                            <div>
                                                <div>
                                                    <p>Price</p>
                                                    <p>{getAllSalonServicesBarberData?.response?.currency}{s?.servicePrice}</p>
                                                </div>
                                                <div>
                                                    <p>Estimated Time</p>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
                                                            onChange={(e) => handleonChange(e, s)}
                                                            maxLength={3}
                                                        />
                                                        <p>mins</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {
                                        AllSalonServices?.map((s) => {
                                            return (
                                                <div className={style.mobile_service_item} key={s._id} >
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <img src={s?.serviceIcon?.url} alt={s?.serviceName} />

                                                                {s.vipService ? <span><CrownIcon /></span> : null}
                                                            </div>

                                                            <p>{s?.serviceName}</p>
                                                            <p>{s?.serviceDesc}</p>

                                                        </div>

                                                        {
                                                            currentBarberServices.find((c) => c.serviceId === s.serviceId) ?
                                                                (<button
                                                                    style={{
                                                                        background: "#450a0a",
                                                                    }}
                                                                    onClick={() => deleteServiceHandler(s)}>Delete</button>) :
                                                                (<button
                                                                    style={{
                                                                        background: "#052e16",
                                                                    }}
                                                                    onClick={() => chooseServiceHandler(s)}>Add</button>)
                                                        }
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p>Price</p>
                                                            <p>{getAllSalonServicesBarberData?.response?.currency}{s?.servicePrice}</p>
                                                        </div>

                                                        <div>
                                                            <p>Estimated Time</p>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
                                                                    onChange={(e) => handleonChange(e, s)}
                                                                    maxLength={3}
                                                                />
                                                                <p>mins</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </main>) :
                                (<main className={`${style.edit_modal_content_container_error} ${darkmodeOn && style.dark}`}>
                                    <p>No services available</p>
                                </main>)
                    }


                    <button onClick={updateBarberProfile} className={style.edit_service_btn}>
                        {
                            barberUpdateProfileLoading ? (<ButtonLoader />) :
                                "Save"
                        }
                    </button>

                </div>
            </Modal>


            <div className={`${style.profile_container}`}>
                <div>
                    <div>
                        <div>

                            {
                                uploadpicLoader ? <Skeleton
                                    count={1}
                                    width={"10rem"}
                                    height={"10rem"}
                                    baseColor={"var(--loader-bg-color)"}
                                    highlightColor={"var(--loader-highlight-color)"}
                                    style={{ borderRadius: "50%" }} /> : <img src={barberProfile?.profile[0]?.url} alt="profile" />
                            }

                            <button
                                className={style.upload_image_container}
                                onClick={() => handleSalonLogoButtonClick()}
                            ><CameraIcon /></button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleProfileFileInputChange}
                            />
                        </div>

                        <h4>{barberProfile?.name ? barberProfile?.name : "User"}</h4>
                        <p>{barberProfile?.salonType === "Barber Shop" ? "Barber" : "Stylist"}</p>
                    </div>
                    {/* <div>
                        <div>
                            <h4>Salons</h4>
                            <p>5</p>
                        </div>
                        <div>
                            <h4>Barbers</h4>
                            <p>30</p>
                        </div>
                        <div>
                            <h4>Customers</h4>
                            <p>30K</p>
                        </div>
                    </div> */}

                    <div>

                        {
                            barberProfile?.salonName ? (
                                <div>
                                    <span><ConnectSalonIcon /></span>
                                    <p>{barberProfile?.salonName}</p>
                                </div>
                            ) : (null)
                        }


                        <div>
                            <span><EmailIcon /></span>
                            <p>{barberProfile?.email}</p>
                        </div>

                        {
                            barberProfile?.mobileNumber ? (
                                <div>
                                    <span><ContactTel /></span>
                                    <p>+{barberProfile?.mobileCountryCode}{" "}{barberProfile?.mobileNumber}</p>
                                </div>
                            ) : (null)
                        }

                    </div>

                    <div>
                        <h4>Complete Your Profile</h4>
                        <div>
                            <span style={{
                                width: `${progress}%`,
                                borderRadius: progress === 100 ? "2rem" : ""
                            }}></span>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <div>
                            <p>Name</p>
                            <input
                                type="text"
                                placeholder='Enter your name'
                                value={name}
                                onChange={(e) => {
                                    setNameError("")
                                    setName(e.target.value)
                                }}
                                onKeyDown={handleKeyPress}
                                style={{
                                    border: nameError ? "0.1rem solid red" : "none"
                                }}
                            />
                            {nameError && <p className={style.error_message}>{nameError}</p>}
                        </div>

                        <div>
                            <p>Email</p>
                            <div className={`${style.input_type_2}`}>
                                <input
                                    type="text"
                                    placeholder='Enter your email'
                                    value={barberProfile?.email}
                                    readOnly
                                    onKeyDown={handleKeyPress}
                                />

                                <button
                                    onClick={() => sendVerificationEmail()}
                                    title={changeEmailVerifiedState ? "Verified" : "NotVerified"}
                                    style={{
                                        color: changeEmailVerifiedState ? "green" : "red",
                                        cursor: changeEmailVerifiedState ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {changeEmailVerifiedState ? <CheckIcon /> : <CloseIcon />}
                                </button>

                            </div>
                        </div>

                        <Modal
                            open={openEmailModal}
                            onClose={() => setOpenEmailModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className={`${style.modal_common_container} ${darkmodeOn && style.dark}`}>
                                <div><OtpEmailIcon /></div>

                                <div>
                                    <p>Please check your email</p>
                                    <p>We have sent a code to your <span style={{ fontWeight: "600" }}>{barberProfile?.email}</span></p>
                                    <div>
                                        {
                                            otp.map((digit, index) => (
                                                <input
                                                    type="text"
                                                    key={index}
                                                    maxLength={1}
                                                    value={digit}
                                                    autoFocus={index === 0}
                                                    ref={(ref) => (otpinputRef.current[index] = ref)}
                                                    onChange={(e) => {
                                                        if (/^\d*$/.test(e.target.value)) {
                                                            handleOtpInputChange(index, e.target.value)
                                                        }
                                                    }
                                                    }
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                ></input>
                                            ))
                                        }
                                    </div>

                                    <p>Didn't get the code ? <span onClick={() => sendVerificationEmail()}>Click to resend</span></p>

                                    <div>
                                        <button onClick={verifyEmailStatusClicked}>Verify</button>
                                    </div>

                                </div>

                                <button onClick={() => setOpenEmailModal(false)}><CloseIcon /></button>
                            </div>
                        </Modal>

                        {
                            barberProfile?.AuthType === "local" ? (<div>
                                <p>Password</p>
                                <input
                                    type="password"
                                    onClick={() => setOpenPasswordModal(true)}
                                    value={"********"}
                                    placeholder=''
                                    readOnly
                                />
                            </div>) : (null)
                        }



                        <Modal
                            open={openPasswordModal}
                            onClose={() => {
                                setOldPasswordError("")
                                setOldPassword("")
                                setNotMatchError("")
                                setPasswordError("")
                                setPassword("")
                                setNotMatchError("")
                                setConfirmPasswordError("")
                                setConfirmPassword("")
                                setOpenPasswordModal(false)
                            }}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
                                <div>
                                    <p>Change your password</p>
                                    <button onClick={() => {
                                        setOldPasswordError("")
                                        setOldPassword("")
                                        setNotMatchError("")
                                        setPasswordError("")
                                        setPassword("")
                                        setNotMatchError("")
                                        setConfirmPasswordError("")
                                        setConfirmPassword("")
                                        setOpenPasswordModal(false)
                                    }}><CloseIcon /></button>
                                </div>
                                <div className={style.modal_content_container}>

                                    <div>
                                        <p>Old Password</p>
                                        <div style={{ border: oldPasswordError ? "0.1rem solid red" : undefined }}>
                                            <input
                                                type={`${seePassword ? "text" : "password"}`}
                                                value={oldPassword}
                                                onChange={(e) => {
                                                    setOldPasswordError("")
                                                    setOldPassword(e.target.value)
                                                }}
                                                placeholder='Enter Old Password'
                                                onKeyDown={handleKeyPressPasswordHandler}
                                            />
                                            <div onClick={() => setSeePassword((prev) => !prev)}>{seePassword ? <Eyevisible /> : <Notvisibleeye />}</div>
                                        </div>
                                        <p className={style.error_message} style={{ marginTop: "1rem" }}>{oldPasswordError}</p>
                                    </div>

                                    <div>
                                        <p>New Password</p>
                                        <div style={{ border: passwordError ? "0.1rem solid red" : undefined }}>
                                            <input
                                                type={`${seeOldPassword ? "text" : "password"}`}
                                                value={password}
                                                onChange={(e) => {
                                                    setNotMatchError("")
                                                    setPasswordError("")
                                                    setPassword(e.target.value)
                                                }}
                                                placeholder='Enter New Password'
                                                onKeyDown={handleKeyPressPasswordHandler}
                                            />
                                            <div onClick={() => setSeeOldPassword((prev) => !prev)}>{seeOldPassword ? <Eyevisible /> : <Notvisibleeye />}</div>
                                        </div>
                                        <p className={style.error_message} style={{ marginTop: "1rem" }}>{passwordError}</p>
                                    </div>

                                    <div>
                                        <p>Confirm Password</p>
                                        <div style={{ border: (confirmPasswordError || notMatchError) ? "0.1rem solid red" : undefined }}>
                                            <input
                                                type={`${seeConfirmPassword ? "text" : "password"}`}
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setNotMatchError("")
                                                    setConfirmPasswordError("")
                                                    setConfirmPassword(e.target.value)
                                                }}
                                                placeholder='Enter Confirm Password'
                                                onKeyDown={handleKeyPressPasswordHandler}
                                            />
                                            <div onClick={() => setSeeConfirmPassword((prev) => !prev)}>{seeConfirmPassword ? <Eyevisible /> : <Notvisibleeye />}</div>
                                        </div>
                                        <p className={style.error_message} style={{ marginTop: "1rem" }}>{(confirmPasswordError || notMatchError)}</p>
                                    </div>

                                    <button
                                        className={style.edit_modal_btn}
                                        onClick={updatePasswordHandler}
                                    >
                                        {
                                            barberUpdatePasswordLoading ?
                                                (
                                                    <ButtonLoader />
                                                ) :
                                                (
                                                    "Save"
                                                )
                                        }

                                    </button>
                                </div>
                            </div>
                        </Modal >


                        <div>
                            <p>Mob. Number</p>
                            <div className={`${style.input_type_3} ${darkmodeOn && style.dark}`} style={{ outline: invalidNumberError && "0.1rem solid red" }}>
                                <div onKeyDown={handleKeyPress}>
                                    <PhoneInput
                                        forceDialCode={true}
                                        defaultCountry={countryflag}
                                        value={mobileNumber}
                                        ref={phoneRef}
                                        onChange={(phone, meta) => handlePhoneChange(phone, meta, "mobileNumber")}
                                    />
                                </div>

                                <button
                                    onClick={() => sendVerificationMobile()}
                                    title={changeMobileVerifiedState ? "Verified" : "NotVerified"}
                                    style={{
                                        color: changeMobileVerifiedState ? "green" : "red",
                                        cursor: changeMobileVerifiedState ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {changeMobileVerifiedState ? <CheckIcon /> : <CloseIcon />}

                                </button>
                            </div>
                            {invalidNumberError && <p className={style.error_message}>{invalidNumberError}</p>}
                        </div>

                        <Modal
                            open={openMobileModal}
                            onClose={() => setOpenMobileModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className={`${style.modal_common_container} ${darkmodeOn && style.dark}`}>
                                <div><OtpMessageIcon /></div>

                                <div>
                                    <p>Please check your message</p>
                                    <p>We have sent a code to your <span style={{ fontWeight: "600" }}>{barberProfile?.mobileNumber}</span></p>
                                    <div>
                                        {
                                            mobileotp.map((digit, index) => (
                                                <input
                                                    type="text"
                                                    key={index}
                                                    maxLength={1}
                                                    value={digit}
                                                    autoFocus={index === 0}
                                                    ref={(ref) => (mobileotpinputRef.current[index] = ref)}
                                                    onChange={(e) => {
                                                        if (/^\d*$/.test(e.target.value)) {
                                                            handleMobileOtpInputChange(index, e.target.value)
                                                        }
                                                    }
                                                    }
                                                    onKeyDown={(e) => handleMobileKeyDown(index, e)}
                                                ></input>
                                            ))
                                        }
                                    </div>

                                    <p>Didn't get the code ? <span onClick={() => sendVerificationMobile()}>Click to resend</span></p>

                                    <div>
                                        <button onClick={verifyMobileStatusClicked}>Verify</button>
                                    </div>

                                </div>

                                <button onClick={() => setOpenMobileModal(false)}><CloseIcon /></button>
                            </div>
                        </Modal>

                        {/* {
                            mobileValue ? (
                                <div className={style.calender_container}>
                                    <p>Date of Birth</p>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateofBirth(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        max={getCurrentDate()}
                                        style={{
                                            colorScheme: darkmodeOn ? "dark" : "light",
                                        }}
                                    />
                                </div>) : (<div className={style.calender_container}>
                                    <p>Date of Birth</p>

                                    <input
                                        type='text'
                                        placeholder='Select Date'
                                        value={dateOfBirth}
                                        onClick={() => setOpenCalender(true)}
                                        readOnly
                                    />
                                    <span onClick={() => setOpenCalender((prev) => !prev)} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></span>

                                    {
                                        openCalender && <ClickAwayListener onClickAway={handleClickAway}>
                                            <div className={style.calender_drop_container}>
                                                <Calendar
                                                    onChange={onChangeHandler}
                                                    value={value}
                                                    maxDate={new Date(2009, 11, 31)}
                                                />
                                            </div>
                                        </ClickAwayListener>
                                    }
                                </div>)
                        } */}

                        <div className={style.calender_container}>
                            <p>Date of Birth</p>

                            <input
                                type='text'
                                placeholder='Select Date'
                                value={dateOfBirth ? ddmmformatDate(dateOfBirth) : ""}
                                onClick={() => setOpenCalender(true)}
                                readOnly
                            />
                            <span onClick={() => setOpenCalender((prev) => !prev)} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></span>

                            {
                                openCalender && <ClickAwayListener onClickAway={handleClickAway}>
                                    <div className={style.calender_drop_container}>
                                        <Calendar
                                            onChange={onChangeHandler}
                                            value={value}
                                            maxDate={new Date(2009, 11, 31)}
                                        />
                                    </div>
                                </ClickAwayListener>
                            }
                        </div>

                        <div>
                            <p>Gender</p>

                            <div className={`${style.gender_container} ${darkmodeOn && style.dark}`} >
                                <input
                                    placeholder='Select gender'
                                    type="text"
                                    value={`${gender ? `${gender}` : ''}`}
                                    onClick={() => genderDropHandler()}
                                    readOnly
                                    onKeyDown={handleKeyPress}
                                />

                                <button onClick={() => setGenderDrop((prev) => !prev)} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></button>

                                {genderDrop &&
                                    <ClickAwayListener onClickAway={() => setGenderDrop(false)}>
                                        <div>
                                            <p onClick={() => setGenderHandler("Male")}>Male</p>
                                            <p onClick={() => setGenderHandler("Female")}>Female</p>
                                            <p onClick={() => setGenderHandler("Other")}>Other</p>
                                        </div>
                                    </ClickAwayListener>}
                            </div>

                        </div>

                        <button className={style.profile_btn} onClick={updateBarberProfile}>
                            {
                                barberUpdateProfileLoading ? (<ButtonLoader />) :
                                    "Update"
                            }
                        </button>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default EditProfile