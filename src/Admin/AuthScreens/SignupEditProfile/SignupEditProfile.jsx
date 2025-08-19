import React, { useEffect, useRef, useState } from 'react'
import style from './SignupEditProfile.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminSignupEditAction } from '../../../Redux/Admin/Actions/AuthAction'
import { useDispatch, useSelector } from 'react-redux'
import { PhoneInput } from 'react-international-phone'
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
import { adminSkipProfileAction } from '../../../Redux/Admin/Actions/AdminProfileAction'

import { PhoneNumberUtil } from 'google-libphonenumber';
import toast from 'react-hot-toast'
import { ClickAwayListener } from '@mui/material';
import { getCurrentDate } from '../../../utils/Date'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import Calendar from 'react-calendar'
import { DropdownIcon } from '../../../newicons'
import { ddmmformatDate } from '../../../../utils/ddmmformatDate'


const SignupEditProfile = () => {

  const dispatch = useDispatch()
  const location = useLocation()
  const admindata = location?.state?.newUser

  const [name, setName] = useState("")
  const [dateOfBirth, setDateofBirth] = useState("")
  const [gender, setGender] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [countryCode, setCountryCode] = useState("")

  const navigate = useNavigate()

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
  const [genderError, setGenderError] = useState("")
  const [invalidNumberError, setInvalidNumberError] = useState("")
  const [dateOfBirthError, setDateOfBirthError] = useState("");

  const updateClicked = () => {

    if (!name) {
      toast.error("Please enter name", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setNameError("Please enter name");
    }

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

    if (!gender) {
      toast.error("Please select gender", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setGenderError("Please select gender");
    }

    if (!dateOfBirth) {
      toast.error("Please select date of birth", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });

      return setDateOfBirthError("Please select date of birth")
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

    const profiledata = { email: admindata?.email, mobileNumber: Number(mobileNumber), name, gender, dateOfBirth, salonId: admindata?.salonId, AuthType: admindata?.AuthType, countryCode: Number(countryCode) };
    dispatch(AdminSignupEditAction(profiledata, navigate))
  }

  const skipClicked = () => {
    const profiledata = { email: admindata?.email, mobileNumber: "", name: "", gender: "", dateOfBirth: "", salonId: admindata?.salonId, countryCode: Number(countryCode) };

    dispatch(adminSkipProfileAction(profiledata, navigate))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateClicked();
    }
  };

  const AdminSignupEdit = useSelector(state => state.AdminSignupEdit)

  const {
    loading: AdminSignupEditLoading,
  } = AdminSignupEdit

  const adminSkipProfile = useSelector(state => state.adminSkipProfile)

  const {
    loading: adminSkipProfileLoading
  } = adminSkipProfile

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

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"


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
    setDateOfBirthError("")
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


  const phoneRef = useRef()

  useEffect(() => {
    if (phoneRef.current) {
      phoneRef.current.style.backgroundColor = "var(--input-bg-color)";
    }
  }, [])

  return (
    <main className={`${style.section} ${darkmodeOn && style.dark}`}>
      {/* <img src="https://dashboard.shadcnuikit.com/images/cover.png" alt="admin_Signin" /> */}
      <div></div>

      <div>
        <div>
          <div>
            <h2>Account Details</h2>
            {
              adminSkipProfileLoading ?
                <button style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}><ButtonLoader /></button> :
                <button onClick={() => skipClicked()}>Skip</button>
            }

          </div>

          <div>
            <label for="name">Name</label>
            <input
              placeholder='Enter name'
              type="text"
              value={name}
              onChange={(e) => {
                setNameError("")
                setName(e.target.value)
              }}
              onKeyDown={handleKeyPress}
              style={{
                border: nameError ? "0.1rem solid red" : "none"
              }}
              id='name'
            />
            <p className={style.error_message}>{nameError}</p>
          </div>

          <div>
            <label for="gender">Gender</label>
            <input
              type="text"
              placeholder='Select gender'
              value={`${gender ? `${gender}` : ''}`}
              onClick={() => {
                setGenderError("")
                genderDropHandler()
              }}
              onKeyDown={handleKeyPress}
              style={{
                border: genderError ? "0.1rem solid red" : "none"
              }}
              id="gender"
              readOnly
            />
            {/* <span onClick={() => genderDropHandler()} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></span> */}
            <p className={style.error_message}>{genderError}</p>

            {genderDrop && <ClickAwayListener onClickAway={() => setGenderDrop(false)}><div>
              <p onClick={() => setGenderHandler("Male")}>Male</p>
              <p onClick={() => setGenderHandler("Female")}>Female</p>
              <p onClick={() => setGenderHandler("Other")}>Other</p>
            </div></ClickAwayListener>}

            <div onClick={() => {
              setGenderError("")
              genderDropHandler()
            }}><DropdownIcon /></div>
          </div>


          <div className={style.calender_container}>
            <label for="dateofBirth">Date of Birth</label>

            <input
              type='text'
              placeholder='Date of birth'
              value={dateOfBirth ? ddmmformatDate(dateOfBirth) : ""}
              onClick={() => setOpenCalender(true)}
              style={{
                border: dateOfBirthError && "0.1rem solid red"
              }}
              id="dateofBirth"
              readOnly
            />


            <p className={style.error_message}>{dateOfBirthError}</p>
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

            <div onClick={() => setOpenCalender(true)}><DropdownIcon /></div>
          </div>


          <div>
            <label id="mobileLabel">Mobile Number</label>
            <div className={`${style.mobile_container} ${darkmodeOn && style.dark}`} style={{ border: invalidNumberError && "0.1rem solid red" }}>
              <div>
                <PhoneInput
                  aria-labelledby="mobileLabel"
                  forceDialCode={true}
                  defaultCountry={countryflag}
                  value={mobileNumber}
                  ref={phoneRef}
                  onKeyDown={handleKeyPress}
                  onChange={(phone, meta) => handlePhoneChange(phone, meta)}
                />
              </div>

            </div>
            <p className={style.error_message}>{invalidNumberError}</p>
          </div>

          <div>
            {
              AdminSignupEditLoading ? <button style={{
                display: "grid",
                placeItems: "center"
              }}><ButtonLoader /></button> : <button onClick={() => updateClicked()}>Update</button>
            }

          </div>

        </div>
      </div>
    </main>
  )
}

export default SignupEditProfile