import React, { useEffect, useRef, useState } from "react";
import style from "./CreateBarber.module.css";
import {
  CameraIcon,
  ClockIcon,
  CloseIcon,
  CrownIcon,
  ProfileIcon,
} from "../../../icons";
import {
  AddIcon,
  DeleteIcon,
  DropdownIcon,
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  WebsiteIcon,
  XIcon,
} from "../../../newicons";
import { useDispatch, useSelector } from "react-redux";
import {
  adminAllSalonServicesAction,
  adminCreateBarberAction,
} from "../../../Redux/Admin/Actions/BarberAction";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../../../components/ButtonLoader/ButtonLoader";
import { PhoneInput } from "react-international-phone";
import { darkmodeSelector } from "../../../Redux/Admin/Reducers/AdminHeaderReducer";
import { PhoneNumberUtil } from "google-libphonenumber";
import toast from "react-hot-toast";
import { Modal } from "@mui/material";
import {
  ClickAwayListener,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import Calendar from "react-calendar";
import Skeleton from "react-loading-skeleton";

import { getCurrentDate } from "../../../utils/Date";
import { ddmmformatDate } from "../../../../utils/ddmmformatDate";
import api from "../../../Redux/api/Api";

const CreateBarber = () => {
  const salonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const adminProfile = useSelector(
    (state) => state.AdminLoggedInMiddleware.entiredata.user[0]
  );

  const AllSalonServicesControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (adminProfile?.salonId !== 0) {
      const controller = new AbortController();
      AllSalonServicesControllerRef.current = controller;

      dispatch(adminAllSalonServicesAction(salonId, controller.signal));

      return () => {
        if (AllSalonServicesControllerRef.current) {
          AllSalonServicesControllerRef.current.abort();
        }
      };
    }
  }, [salonId, dispatch, adminProfile]);

  const adminAllSalonServices = useSelector(
    (state) => state.adminAllSalonServices
  );

  const {
    loading: adminAllSalonServicesLoading,
    resolve: adminAllSalonServicesResolve,
    response: allSalonServices,
  } = adminAllSalonServices;

  const [chooseServices, setChooseServices] = useState([]);
  const [serviceEWTValues, setServiceEWTValues] = useState({});

  useEffect(() => {
    if (allSalonServices) {
      const initialEWTValues = {};
      allSalonServices.forEach((service) => {
        initialEWTValues[service._id] = service.serviceEWT;
      });
      setServiceEWTValues(initialEWTValues);
    }
  }, [allSalonServices]);

  const chooseServiceHandler = (service) => {
    setChooseServices([...chooseServices, service]);
  };

  const deleteServiceHandler = (service) => {
    setChooseServices(chooseServices.filter((f) => f._id !== service._id));

    const initialEWTValues = {};
    allSalonServices.forEach((service) => {
      initialEWTValues[service._id] = service.serviceEWT;
    });
    setServiceEWTValues(initialEWTValues);
  };

  const handleEWTChange = (serviceId, newValue) => {
    setServiceEWTValues({
      ...serviceEWTValues,
      [serviceId]: Number(newValue),
    });
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("barberdata")) || {};

    setName(storedData.name);
    setEmail(storedData.email);
    setNickName(storedData.nickName);
    setDateOfBirth(storedData.dateOfBirth);
    setMobileNumber(storedData.mobileNumber);
  }, []);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [invalidNumberError, setInvalidNumberError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [servicesError, setServicesError] = useState("");

  const [invalidnumber, setInvalidNumber] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Barber profile picture

  const [salonLogo, setSalonLogo] = useState("");

  const fileInputRef = useRef(null);

  const handleSalonLogoButtonClick = () => {
    fileInputRef.current.click();
  };

  const [uploadSalonLogo, setUploadSalonLogo] = useState("");

  const handleSalonFileInputChange = async (e) => {
    const uploadImage = e.target.files[0];

    const allowedTypes = ["image/jpeg", "image/webp", "image/png"];
    if (!allowedTypes.includes(uploadImage.type)) {
      toast.error("Please upload only valid image files (JPEG, WebP, PNG).", {
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

    // Check if the image size exceeds 2MB (2 * 1024 * 1024 bytes)
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (uploadImage.size > maxSizeInBytes) {
      toast.error("File size must be lower than 2mb", {
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

    const imageUrl = URL.createObjectURL(uploadImage);

    setSalonLogo(imageUrl);
    setUploadSalonLogo(uploadImage);
  };

  const adminCreateBarber = useSelector((state) => state.adminCreateBarber);

  const {
    loading: adminCreateBarberLoading,
    response: adminCreateBarberResponse,
  } = adminCreateBarber;

  // console.log("adminCreateBarberResponse ", adminCreateBarberResponse?.barberId);

  const [uploadSalonLogoLoader, setUploadSalonLogoLoader] = useState(false);

  useEffect(() => {
    if (adminCreateBarberResponse?.barberId) {
      //For Salon Logo
      if (adminCreateBarberResponse?.barberId && uploadSalonLogo != "") {
        const uploadImageHandler = async () => {
          if (uploadSalonLogo != null) {
            const formData = new FormData();

            if (adminCreateBarberResponse?.email) {
              formData.append("email", adminCreateBarberResponse?.email);
              formData.append("profile", uploadSalonLogo);

              try {
                setUploadSalonLogoLoader(true);
                await api.post(
                  "/api/admin/uploadBarberProfilePictureByAdmin",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );

                // const { data } = await api.post(
                //   `/api/admin/getAllSalonsByAdmin`,
                //   {
                //     adminEmail: email,
                //   }
                // );

                // dispatch({
                //   type: GET_ADMIN_SALONLIST_SUCCESS,
                //   payload: data,
                // });

                // dispatch(adminGetDefaultSalonAction(email));

                toast.success("Barber profile pic uploaded successfully", {
                  duration: 3000,
                  style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: "0.3rem",
                    background: "#333",
                    color: "#fff",
                  },
                });
              } catch (error) {
                toast.error(error?.response?.data?.message, {
                  duration: 3000,
                  style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: "0.3rem",
                    background: "#333",
                    color: "#fff",
                  },
                });
                setSalonLogo("");
                setUploadSalonLogo("");
              } finally {
                setUploadSalonLogoLoader(false);
              }
            }
          }
        };

        uploadImageHandler();
      }
    }
  }, [adminCreateBarberResponse?.barberId]);

  const CreateBarberHandler = () => {
    if (!name) {
      toast.error("Please enter name", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setNameError("Please enter name");
    }

    if (name.length === 0 || name.length > 20) {
      toast.error("Name must be between 1 to 20 characters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setNameError("Name must be between 1 to 20 characters");
    }

    if (!email) {
      toast.error("Please enter email", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setEmailError("Please enter email");
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setEmailError("Invalid email format");
    }

    if (!nickName) {
      toast.error("Please enter nickname", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setNickNameError("Please enter nickname");
    }

    if (nickName.length === 0 || nickName.length > 20) {
      toast.error("Nickname must be between 1 to 20 characters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setNickNameError("Nickname must be between 1 to 20 characters");
    }

    if (invalidnumber) {
      toast.error("Invalid Number", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      return setInvalidNumberError("Invalid Number");
    }

    if (chooseServices.length === 0) {
      toast.error("Please provide a service", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      return setServicesError("Please provide a service");
    }

    const barberdata = {
      name: name,
      email: email,
      nickName: nickName,
      mobileNumber: Number(mobileNumber),
      countryCode: Number(countryCode),
      dateOfBirth: dateOfBirth,
      salonId,
      barberServices: chooseServices.map((service) => ({
        ...service,
        barberServiceEWT: serviceEWTValues[service._id],
      })),
    };

    dispatch(adminCreateBarberAction(barberdata, navigate));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      CreateBarberHandler();
    }
  };

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  const [countryflag, setCountryFlag] = useState("gb");

  const handlePhoneChange = (phone, meta, localname) => {
    setInvalidNumberError("");
    const { country, inputValue } = meta;

    const isValid = isPhoneValid(phone);

    if (isValid) {
      setMobileNumber(phone);
      setCountryCode(country?.dialCode);
      setCountryFlag(country?.iso2);
      setInvalidNumber(false);

      const existingData = JSON.parse(localStorage.getItem("barberdata")) || {};

      localStorage.setItem(
        "barberdata",
        JSON.stringify({
          ...existingData,
          ["mobileNumber"]: phone,
          ["dialCode"]: country?.dialCode,
          ["countryflag"]: country?.iso2,
        })
      );
    } else {
      setInvalidNumber(true);
    }
  };

  const setHandler = (setState, value, localname, errorState) => {
    errorState("");
    setState(value);
    // console.log("Saving to localStorage:", localname, value);

    const existingData = JSON.parse(localStorage.getItem("barberdata")) || {};

    localStorage.setItem(
      "barberdata",
      JSON.stringify({
        ...existingData,
        [localname]: value,
      })
    );
  };

  const adminGetDefaultSalon = useSelector(
    (state) => state.adminGetDefaultSalon
  );

  const { response: adminGetDefaultSalonResponse } = adminGetDefaultSalon;

  // console.log("Create Barber ", adminGetDefaultSalonResponse)

  // const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Calender Logic

  const [openCalender, setOpenCalender] = useState(false);

  const handleClickAway = () => {
    setOpenCalender(false);
  };

  const [value, onChange] = useState(new Date());

  const convertDateToYYYYMMDD = (dateInput) => {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onChangeHandler = (dateInput) => {
    const formattedDate = convertDateToYYYYMMDD(dateInput);
    onChange(formattedDate);
    setHandler(
      setDateOfBirth,
      formattedDate,
      "dateOfBirth",
      setDateOfBirthError
    );
    setOpenCalender(false);
  };

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const currentSalonType = localStorage.getItem("CurrentSalonType");

  // =======================================

  const steps = [
    {
      label: `${
        currentSalonType === "Barber Shop"
          ? "Barbers"
          : currentSalonType === "Hair Dresser"
          ? "Stylists"
          : ""
      } Information`,
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: `Enter ${
            currentSalonType === "Barber Shop"
              ? "barber"
              : currentSalonType === "Hair Dresser"
              ? "stylist"
              : ""
          } name`,
          value: name,
          setState: setName,
          setError: setNameError,
          error: nameError,
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          placeholder: `Enter ${
            currentSalonType === "Barber Shop"
              ? "barber"
              : currentSalonType === "Hair Dresser"
              ? "stylist"
              : ""
          } email`,
          value: email,
          setState: setEmail,
          setError: setEmailError,
          error: emailError,
        },
        {
          name: "nickName",
          label: "Nick Name",
          type: "text",
          placeholder: `Enter ${
            currentSalonType === "Barber Shop"
              ? "barber"
              : currentSalonType === "Hair Dresser"
              ? "stylist"
              : ""
          } nickname`,
          value: nickName,
          setState: setNickName,
          setError: setNickNameError,
          error: nickNameError,
        },
        {
          name: "mobileNumber",
          label: "Mobile Number",
          type: "text",
          placeholder: `Enter ${
            currentSalonType === "Barber Shop"
              ? "barber"
              : currentSalonType === "Hair Dresser"
              ? "stylist"
              : ""
          } mobile number`,
        },
        {
          name: "dateofbirth",
          label: "Date of Birth",
          type: "text",
          placeholder: `Enter ${
            currentSalonType === "Barber Shop"
              ? "barber"
              : currentSalonType === "Hair Dresser"
              ? "stylist"
              : ""
          } date of birth`,
        },
        {
          name: "profilePic",
          label: "Select your profile pic",
          type: "file",
          accept: "image/*",
        },
      ],
    },
    {
      label: `${
        currentSalonType === "Barber Shop"
          ? "Barber"
          : currentSalonType === "Hair Dresser"
          ? "Stylist"
          : ""
      } Services`,
      name: `${
        currentSalonType === "Barber Shop"
          ? "barber"
          : currentSalonType === "Hair Dresser"
          ? "stylist"
          : ""
      }services`,
      fields: [],
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    accountInfo: "",
    projectID: "",
    ownerName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
  });

  const handleNext = () => {
    if (activeStep === 0) {
      if (!name) {
        toast.error("Please enter name", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setNameError("Please enter name");
      }

      if (name.length === 0 || name.length > 20) {
        toast.error("Name must be between 1 to 20 characters", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setNameError("Name must be between 1 to 20 characters");
      }

      if (!email) {
        toast.error("Please enter email", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setEmailError("Please enter email");
      }

      if (!emailRegex.test(email)) {
        toast.error("Invalid email format", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setEmailError("Invalid email format");
      }

      if (!nickName) {
        toast.error("Please enter nickname", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setNickNameError("Please enter nickname");
      }

      if (nickName.length === 0 || nickName.length > 20) {
        toast.error("Nickname must be between 1 to 20 characters", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setNickNameError("Nickname must be between 1 to 20 characters");
      }

      if (invalidnumber) {
        toast.error("Invalid Number", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        return setInvalidNumberError("Invalid Number");
      }

      // if (!dateOfBirth) {
      //   toast.error("Please select date of birth", {
      //     duration: 3000,
      //     style: {
      //       fontSize: "var(--font-size-2)",
      //       borderRadius: '0.3rem',
      //       background: '#333',
      //       color: '#fff',
      //     },
      //   });

      //   return setDateOfBirthError("Please select date of birth")
      // }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      accountInfo: "",
      projectID: "",
      ownerName: "",
      email: "",
      cardNumber: "",
      expiryDate: "",
    });
  };

  const [open, setOpen] = useState(false);

  return (
    <section className={`${style.section}`}>
      <div>
        <h2>
          Create{" "}
          {currentSalonType === "Barber Shop"
            ? "Barbers"
            : currentSalonType === "Hair Dresser"
            ? "Stylists"
            : ""}
        </h2>
      </div>

      <div className={`${style.form_main_container}`}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            "& .MuiStepContent-root": {
              borderLeft: "1px solid #bdbdbd",
              paddingRight: "0px",
            },

            "& .MuiStepIcon-root": {
              width: "2.5rem",
              height: "2.5rem",
              // fontSize: "2rem",
              color: "var(--bg-tertiary)",
            },
            "& .MuiStepIcon-text": {
              fontSize: "1.4rem",
              // color: "var(--text-primary)",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "var(--bg-tertiary)",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              background: "green",
              borderRadius: "50%",
              color: "#fff",
              padding: "0.5rem",
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <span className={`${style.stepper_heading}`}>{step.label}</span>
              </StepLabel>

              {step.label ===
                `${
                  currentSalonType === "Barber Shop"
                    ? "Barbers"
                    : currentSalonType === "Hair Dresser"
                    ? "Stylists"
                    : ""
                } Information` && (
                <StepContent>
                  <main className={`${style.form_container}`}>
                    {step.fields.map((field) => (
                      <div key={field.name} className={`${style.form_group}`}>
                        <label>{field.label}</label>

                        {field.name === "mobileNumber" ? (
                          <>
                            <PhoneInput
                              forceDialCode={true}
                              defaultCountry={countryflag}
                              value={mobileNumber}
                              onChange={(phone, meta) =>
                                handlePhoneChange(phone, meta, "mobileNumber")
                              }
                            />
                            {invalidNumberError ? (
                              <p style={{ color: "red", fontSize: "1.4rem" }}>
                                {invalidNumberError}
                              </p>
                            ) : null}
                          </>
                        ) : field.name === "dateofbirth" ? (
                          <>
                            <div
                              className={`${style.select_container}`}
                              onClick={() => setOpenCalender((prev) => !prev)}
                            >
                              <input
                                type={field.type}
                                name={field.name}
                                value={
                                  dateOfBirth ? ddmmformatDate(dateOfBirth) : ""
                                }
                                placeholder={field.placeholder}
                                readOnly
                              />
                              <div>
                                <DropdownIcon />
                              </div>

                              {openCalender ? (
                                <ClickAwayListener
                                  onClickAway={() => setOpenCalender(false)}
                                >
                                  <div
                                    className={`${style.select_dropdown_container}`}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <Calendar
                                      onChange={onChangeHandler}
                                      value={value}
                                      maxDate={new Date(2009, 11, 31)}
                                    />
                                  </div>
                                </ClickAwayListener>
                              ) : null}
                            </div>
                            {dateOfBirthError ? (
                              <p style={{ color: "red", fontSize: "1.4rem" }}>
                                {dateOfBirthError}
                              </p>
                            ) : null}
                          </>
                        ) : field.name === "profilePic" ? (
                          <div className={`${style.profile_picture_container}`}>
                            {uploadSalonLogoLoader ? (
                              <Skeleton
                                count={1}
                                width={"10rem"}
                                height={"10rem"}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"}
                                style={{ borderRadius: "50%" }}
                              />
                            ) : salonLogo ? (
                              <img src={salonLogo} alt="profile" />
                            ) : (
                              <ProfileIcon
                                style={{
                                  width: "10rem",
                                  height: "10rem",
                                  borderRadius: "50%",
                                  backgroundColor: "#fff",
                                  border: "0.1rem solid gray",
                                }}
                              />
                            )}
                            <button
                              className={style.upload_image_container}
                              onClick={() => handleSalonLogoButtonClick()}
                            >
                              <CameraIcon />
                            </button>

                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleSalonFileInputChange}
                            />
                          </div>
                        ) : (
                          <>
                            <input
                              type={field.type}
                              name={field.name}
                              value={field.value}
                              placeholder={field.placeholder}
                              onChange={(e) =>
                                setHandler(
                                  field.setState,
                                  e.target.value,
                                  field.name,
                                  field.setError
                                )
                              }
                            />
                            {field.error ? (
                              <p style={{ color: "red", fontSize: "1.4rem" }}>
                                {field.error}
                              </p>
                            ) : null}
                          </>
                        )}
                      </div>
                    ))}
                    <div className={`${style.button_container}`}>
                      <div></div>
                      <button onClick={handleNext}>
                        {index === steps.length - 1 ? "Finish" : "Continue"}
                      </button>
                    </div>
                  </main>
                </StepContent>
              )}

              {step.label ===
                `${
                  currentSalonType === "Barber Shop"
                    ? "Barber"
                    : currentSalonType === "Hair Dresser"
                    ? "Stylist"
                    : ""
                } Services` && (
                <StepContent>
                  <main className={`${style.service_container}`}>
                    <div>
                      <div>
                        {adminAllSalonServicesResolve &&
                        allSalonServices?.length > 0
                          ? allSalonServices.map((s) => (
                              <div key={s._id} className={style.service_item}>
                                <div>
                                  <div>
                                    <div>
                                      <img
                                        src={s?.serviceIcon?.url}
                                        alt={s?.serviceName}
                                      />
                                    </div>
                                    <div>
                                      <p>{s?.serviceName}</p>
                                      <p>{s?.vipService ? "VIP" : "Regular"}</p>
                                      <p>{s?.serviceDesc}</p>
                                    </div>
                                  </div>

                                  {chooseServices.find(
                                    (c) => c._id === s._id
                                  ) ? (
                                    <button
                                      style={{
                                        background: "#450a0a",
                                      }}
                                      onClick={() => deleteServiceHandler(s)}
                                    >
                                      Delete
                                    </button>
                                  ) : (
                                    <button
                                      style={{
                                        background: "#052e16",
                                      }}
                                      onClick={() => chooseServiceHandler(s)}
                                    >
                                      Add
                                    </button>
                                  )}
                                </div>
                                <div>
                                  <div>
                                    <p>Price</p>
                                    <p>
                                      {adminGetDefaultSalonResponse?.currency}
                                      {s?.servicePrice}
                                    </p>
                                  </div>
                                  <div>
                                    <p>Estimated Time</p>
                                    <div>
                                      <input
                                        type="text"
                                        value={serviceEWTValues[s._id]}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(
                                            /[^0-9]/g,
                                            ""
                                          ); // Only keep digits
                                          handleEWTChange(s._id, value);
                                        }}
                                        maxLength={3}
                                      />
                                      <p>mins</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          : null}

                        {adminAllSalonServicesResolve &&
                        allSalonServices?.length > 0
                          ? allSalonServices?.map((s) => {
                              return (
                                <div
                                  className={style.mobile_service_item}
                                  key={s._id}
                                >
                                  <div>
                                    <div>
                                      <div>
                                        <img
                                          src={s?.serviceIcon?.url}
                                          alt={s?.serviceName}
                                        />

                                        {s.vipService ? (
                                          <span>
                                            <CrownIcon />
                                          </span>
                                        ) : null}
                                      </div>

                                      <p>{s?.serviceName}</p>
                                      <p>{s?.serviceDesc}</p>
                                    </div>

                                    {chooseServices.find(
                                      (c) => c._id === s._id
                                    ) ? (
                                      <button
                                        style={{
                                          background: "#450a0a",
                                        }}
                                        onClick={() => deleteServiceHandler(s)}
                                      >
                                        Delete
                                      </button>
                                    ) : (
                                      <button
                                        style={{
                                          background: "#052e16",
                                        }}
                                        onClick={() => chooseServiceHandler(s)}
                                      >
                                        Add
                                      </button>
                                    )}
                                  </div>
                                  <div>
                                    <div>
                                      <p>Price</p>
                                      <p>
                                        {adminGetDefaultSalonResponse?.currency}
                                        {s?.servicePrice}
                                      </p>
                                    </div>

                                    <div>
                                      <p>Estimated Time</p>
                                      <div>
                                        <input
                                          type="text"
                                          value={serviceEWTValues[s._id]}
                                          onChange={(e) => {
                                            const value =
                                              e.target.value.replace(
                                                /[^0-9]/g,
                                                ""
                                              ); // Only keep digits
                                            handleEWTChange(s._id, value);
                                          }}
                                          maxLength={3}
                                        />
                                        <p>mins</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : null}
                      </div>

                      {/* {
                        adminAllSalonServicesLoading ?
                          (<div>
                            <Skeleton count={1}
                              height={"15rem"}
                              width={"100%"}
                              baseColor={"var(--loader-bg-color)"}
                              highlightColor={"var(--loader-highlight-color)"}
                              style={{
                                borderRadius: "0.3rem",
                                marginBottom: "1rem"
                              }}
                            />

                            <Skeleton count={1}
                              height={"15rem"}
                              width={"100%"}
                              baseColor={"var(--loader-bg-color)"}
                              highlightColor={"var(--loader-highlight-color)"}
                              style={{
                                borderRadius: "0.3rem",
                                marginBottom: "1rem"
                              }}
                            />
                          </div>) :
                          adminAllSalonServicesResolve && allSalonServices?.length > 0 ?
                            (
                              <div>
                                {allSalonServices.map((s) => (
                                  <div key={s._id} className={style.service_item}>
                                    <div>
                                      <div>
                                        <div><img src={s?.serviceIcon?.url} alt={s?.serviceName} /></div>
                                        <div>
                                          <p>{s?.serviceName}</p>
                                          <p>{s?.vipService ? "VIP" : "Regular"}</p>
                                          <p>{s?.serviceDesc}</p>
                                        </div>
                                      </div>

                                      {
                                        chooseServices.find((c) => c._id === s._id) ?
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
                                        <p>{adminGetDefaultSalonResponse?.currency}{s?.servicePrice}</p>
                                      </div>
                                      <div>
                                        <p>Estimated Time</p>
                                        <div>
                                          <input
                                            type="text"
                                            value={serviceEWTValues[s._id]}
                                            onChange={(e) => {
                                              const value = e.target.value.replace(/[^0-9]/g, ''); // Only keep digits
                                              handleEWTChange(s._id, value);
                                            }}
                                            maxLength={3}
                                          />
                                          <p>mins</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) :
                            (<div style={{ display: "grid", placeItems: "center" }}>
                              <p style={{ fontSize: "1.4rem" }}>No services available</p>
                            </div>)
                      } */}

                      <button onClick={handleBack} disabled={index === 0}>
                        Back
                      </button>
                    </div>

                    <div className={`${style.button_container}`}>
                      <div></div>
                      <button
                        onClick={handleNext}
                        disabled={chooseServices.length === 0}
                        style={{
                          cursor:
                            chooseServices.length === 0
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {index === steps.length - 1 ? "Finish" : "Continue"}
                      </button>
                    </div>
                  </main>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <div className={`${style.complete}`}>
            <p>
              All steps have been successfully completed. Click the{" "}
              <span
                style={{ color: "var(--bg-secondary)", fontWeight: "bold" }}
              >
                Create
              </span>{" "}
              button to add a new{" "}
              {currentSalonType === "Barber Shop"
                ? "barber"
                : currentSalonType === "Hair Dresser"
                ? "stylist"
                : ""}
              .
            </p>
            <div>
              <button onClick={handleBack}>Back</button>
              {adminCreateBarberLoading ? (
                <button
                  style={{
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <ButtonLoader />
                </button>
              ) : (
                <button onClick={CreateBarberHandler}>Create</button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateBarber;
