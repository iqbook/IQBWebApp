import React, { useEffect, useRef, useState } from 'react'
import style from "./EditProfile.module.css"
import { PhoneInput } from 'react-international-phone';
import { useDispatch, useSelector } from 'react-redux';
import { adminSendVerifyEmailAction, adminSendVerifyMobileAction, adminUpdatePasswordAction, adminUpdateProfileAction, adminVerifiedEmailStatusAction, adminVerifiedMobileStatusAction } from '../../Redux/Admin/Actions/AdminProfileAction';
import { useNavigate } from 'react-router-dom';
import api from '../../Redux/api/Api';
import { ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS } from '../../Redux/Admin/Constants/constants';
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';
import toast from 'react-hot-toast';
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';

import { PhoneNumberUtil } from 'google-libphonenumber';

import { ClickAwayListener, Modal } from '@mui/material';
import { getCurrentDate } from '../../utils/Date';

import Calendar from 'react-calendar';
import { CameraIcon, CheckIcon, CloseIcon, ContactTel, DropdownIcon, EmailIcon, OtpEmailIcon } from '../../newicons'
import { Eyevisible, Notvisibleeye, OtpMessageIcon, StripeIcon } from '../../icons';
import Skeleton from 'react-loading-skeleton';
import { ddmmformatDate } from '../../../utils/ddmmformatDate'

const EditProfile = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])


    const [changeEmailVerifiedState, setChangeEmailVerifiedState] = useState(adminProfile?.emailVerified)
    const [changeMobileVerifiedState, setChangeMobileVerifiedState] = useState(adminProfile?.mobileVerified)

    const [name, setName] = useState("")
    const [dateOfBirth, setDateofBirth] = useState("")
    const [gender, setGender] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [countryCode, setCountryCode] = useState("")


    useEffect(() => {
        if (adminProfile) {
            setMobileNumber(`${adminProfile?.mobileCountryCode?.toString()}${adminProfile?.mobileNumber?.toString()}`)
            setName(adminProfile?.name)
            setDateofBirth(adminProfile?.dateOfBirth?.split('T')[0])
            setGender(adminProfile?.gender)
            setCountryCode(adminProfile?.mobileCountryCode?.toString())
        }
    }, [adminProfile])

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

        formData.append('email', adminProfile?.email);
        formData.append('profile', uploadImage);
        formData.append('salonId', adminProfile?.salonId)

        try {
            setUploadpicLoader(true)
            await api.post('/api/admin/uploadAdminProfilePicture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadpicLoader(false)


            const { data: adminloggedindata } = await api.get('/api/admin/adminloggedin');

            dispatch({
                type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
                payload: adminloggedindata
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

            dispatch(adminSendVerifyEmailAction(adminProfile?.email, setOpenEmailModal))
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

            dispatch(adminSendVerifyMobileAction(adminProfile?.email, setOpenMobileModal));
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



    const [genderDrop, setGenderDrop] = useState(false)

    const genderDropHandler = () => {
        setGenderDrop((prev) => !prev)
    }

    const setGenderHandler = (value) => {
        setGender(value)
        setGenderDrop(false)
    }


    const [invalidnumber, setInvalidNumber] = useState(false)

    const [nameError, setNameError] = useState("")
    const [invalidNumberError, setInvalidNumberError] = useState("")

    const updateAdminProfile = () => {

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
            email: adminProfile?.email,
            dateOfBirth,
            mobileNumber: Number(mobileNumber),
            countryCode: Number(countryCode),
            name,
            gender,
        }

        // console.log(profiledata)

        dispatch(adminUpdateProfileAction(profiledata, navigate))


    }


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            updateAdminProfile();
        }
    };

    const handleKeyPressPassword = (e) => {
        if (e.key === "Enter") {
            updatePasswordHandler();
        }
    };

    const verifyEmailStatusClicked = () => {
        const currentOtp = otp?.join("")

        dispatch(adminVerifiedEmailStatusAction(adminProfile?.email, currentOtp, setOpenEmailModal, setOtp, setChangeEmailVerifiedState))
    }

    const verifyMobileStatusClicked = () => {
        const currentOtp = mobileotp?.join("")

        dispatch(adminVerifiedMobileStatusAction(adminProfile?.email, currentOtp, setOpenMobileModal, setMobileOtp, setChangeMobileVerifiedState))
    }

    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const adminUpdateProfile = useSelector(state => state.adminUpdateProfile)

    const {
        loading: adminUpdateProfileLoading,
    } = adminUpdateProfile

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
            email: adminProfile?.email,
            password,
            oldPassword
        }

        dispatch(adminUpdatePasswordAction(profiledata, navigate))
    }

    const adminUpdatePassword = useSelector(state => state.adminUpdatePassword)

    const {
        loading: adminUpdatePasswordLoading
    } = adminUpdatePassword

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
        setInvalidNumber("")
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
        const phoneInput = document.querySelector(
            '.react-international-phone-input-container .react-international-phone-input'
        );

        if (phoneInput) {
            // phoneInput.style.color = darkmodeOn ? 'var(--light-color-4)' : 'var(--light-color-2)';
            phoneInput.style.color = 'var(--text-primary)';
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

    const [connectStripeLoading, setConnectStripeLoading] = useState(false)

    const stripeConnectHandler = async () => {
        try {
            const onboardData = {
                email: adminProfile?.email,
                vendorAccountId: adminProfile?.vendorAccountId
            }
            setConnectStripeLoading(true)
            const { data } = await api.post("/api/onboard-vendor-account", onboardData)
            window.location.href = data?.response?.url

            setConnectStripeLoading(false)
        } catch (error) {
            setConnectStripeLoading(false)
            toast.error(error?.response?.data?.response, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return
        }

    }

    const loginStripeHandler = async () => {
        try {
            const { data } = await api.post("/api/vendor-loginlink", { email: adminProfile?.email })

            window.open(data.url, '_blank');
        } catch (error) {
            console.log(error)
        }
    }

    let progress = 0;
    if (adminProfile?.name) progress = 25;
    if (adminProfile?.name && adminProfile?.mobileNumber) progress = 50;
    if (adminProfile?.name && adminProfile?.mobileNumber && adminProfile?.dateOfBirth) progress = 75;
    if (adminProfile?.name && adminProfile?.mobileNumber && adminProfile?.dateOfBirth && adminProfile?.gender) progress = 100;

    // console.log(adminProfile)

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
                {/* <button onClick={() => navigate("/admin-salon/createsalon")}>Create</button> */}

                {
                    adminProfile?.vendorAccountDetails?.vendorTransferStatus === "active" ?
                        (<button className={style.stripe_connect_btn}
                            onClick={loginStripeHandler}
                        ><StripeIcon />Login to Stripe</button>) :
                        (<button className={style.stripe_connect_btn}
                            onClick={connectStripeLoading ? () => { } : stripeConnectHandler}
                        ><StripeIcon />{connectStripeLoading ? "Loading..." : "Connect to Stripe"}</button>)
                }
            </div>

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
                                    style={{ borderRadius: "50%" }} /> : <img src={adminProfile?.profile[0]?.url} alt="profile" />
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

                        <h4>{adminProfile?.name ? adminProfile?.name : "User"}</h4>
                        <p>Admin</p>
                    </div>
                    <div>
                        <div>
                            <h4>Salons</h4>
                            <p>{adminProfile?.salonCount}</p>
                        </div>
                        <div>
                            <h4>Barbers</h4>
                            <p>{adminProfile?.barbersCount}</p>
                        </div>
                        <div>
                            <h4>Customers</h4>
                            <p>{adminProfile?.customersCount}</p>
                        </div>
                    </div>

                    <div>
                        <div>
                            <span><EmailIcon /></span>
                            <p>{adminProfile?.email}</p>
                        </div>

                        {
                            adminProfile?.mobileNumber ? (
                                <div>
                                    <span><ContactTel /></span>
                                    <p>+{adminProfile?.mobileCountryCode}{" "}{adminProfile?.mobileNumber}</p>
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
                                    value={adminProfile?.email}
                                    readOnly
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
                                    <p>We have sent a code to your <span style={{ fontWeight: "600", color: "var(--bg-secondary)" }}>{adminProfile?.email}</span></p>
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
                            adminProfile?.AuthType === "local" ? (
                                <div>
                                    <p>Password</p>
                                    <input
                                        type="password"
                                        value={"********"}
                                        onClick={() => setOpenPasswordModal(true)}
                                        readOnly
                                    />
                                </div>
                            ) : (null)
                        }


                        <Modal
                            open={openPasswordModal}
                            onClose={() => setOpenPasswordModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
                                <div>
                                    <p>Change your password</p>
                                    <button onClick={() => setOpenPasswordModal(false)}><CloseIcon /></button>
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
                                                onKeyDown={handleKeyPressPassword}
                                            />
                                            <div onClick={() => setSeePassword((prev) => !prev)}>{seePassword ? <Eyevisible /> : <Notvisibleeye />}</div>
                                        </div>
                                        {oldPasswordError && <p className={style.error_message} style={{ marginTop: "1rem" }}>{oldPasswordError}</p>}
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
                                                onKeyDown={handleKeyPressPassword}
                                            />
                                            <div onClick={() => setSeeOldPassword((prev) => !prev)}>{seeOldPassword ? <Eyevisible /> : <Notvisibleeye />}</div>
                                        </div>
                                        {passwordError && <p className={style.error_message} style={{ marginTop: "1rem" }}>{passwordError}</p>}
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
                                                onKeyDown={handleKeyPressPassword}
                                            />
                                            <div onClick={() => setSeeConfirmPassword((prev) => !prev)}>{seeConfirmPassword ? <Eyevisible /> : <Notvisibleeye />}</div>
                                        </div>
                                        {(confirmPasswordError || notMatchError) && <p className={style.error_message} style={{ marginTop: "1rem" }}>{(confirmPasswordError || notMatchError)}</p>}
                                    </div>

                                    <button
                                        className={style.edit_modal_btn}
                                        onClick={updatePasswordHandler}
                                    >
                                        {
                                            adminUpdatePasswordLoading ?
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
                                    <p>We have sent a code to your <span style={{ fontWeight: "600", color: "var(--bg-secondary)" }}>{adminProfile?.mobileNumber}</span></p>
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

                                    <p>Didn't get the code ?
                                        <span onClick={() => sendVerificationMobile()}>Click to resend</span>
                                    </p>

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
                                            width: "100% !important"
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
                                value={ddmmformatDate(dateOfBirth)}
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

                        <button className={style.profile_btn} onClick={updateAdminProfile}>
                            {
                                adminUpdateProfileLoading ? (<ButtonLoader />) :
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