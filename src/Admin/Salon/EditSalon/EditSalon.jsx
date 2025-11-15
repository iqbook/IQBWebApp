import React, { useEffect, useRef, useState } from "react";
import style from "./EditSalon.module.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  CameraIcon,
  ClockIcon,
  CloseIcon,
  CrownIcon,
  EditIcon,
  Uploadicon,
} from "../../../icons";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  adminEditSalonAction,
  getAdminAllCitiesAction,
  getAdminAllCountriesAction,
  getAdminAllSalonIconAction,
  getAdminAllTimezoneAction,
  getAdminSalonImagesAction,
  getAdminSalonLogoAction,
  getAllSalonCategoriesAction,
} from "../../../Redux/Admin/Actions/SalonAction";
import api from "../../../Redux/api/Api";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonLoader from "../../../components/ButtonLoader/ButtonLoader";
import toast from "react-hot-toast";
import { PhoneInput } from "react-international-phone";
import { darkmodeSelector } from "../../../Redux/Admin/Reducers/AdminHeaderReducer";
import {
  ClickAwayListener,
  Modal,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import {
  DeleteIcon,
  DropdownIcon,
  FacebookIcon,
  InstagramIcon,
  ScissorIcon,
  TiktokIcon,
  WebsiteIcon,
  XIcon,
} from "../../../newicons";

import { PhoneNumberUtil } from "google-libphonenumber";
import { adminGetDefaultSalonAction } from "../../../Redux/Admin/Actions/AdminHeaderAction";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  OverlayView,
} from "@react-google-maps/api";

const EditSalon = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const currentSalon = location?.state;

  const [salonImages, setSalonImages] = useState([]);
  const [salonLogo, setSalonLogo] = useState([]);

  const getAdminSalonImages = useSelector((state) => state.getAdminSalonImages);

  const {
    loading: getAdminSalonImagesLoading,
    resolve: getAdminSalonImagesResolve,
    response: AdminSalonImages,
  } = getAdminSalonImages;

  const getAdminSalonLogo = useSelector((state) => state.getAdminSalonLogo);

  const {
    loading: getAdminSalonLogoLoading,
    resolve: getAdminSalonLogoResolve,
    response: AdminSalonLogo,
  } = getAdminSalonLogo;

  useEffect(() => {
    if (currentSalon?.salonId) {
      dispatch(getAdminSalonImagesAction(currentSalon?.salonId));
      dispatch(getAdminSalonLogoAction(currentSalon?.salonId));
    }
  }, [currentSalon]);

  // console.log("Hurrayy  ", AdminSalonImages)
  // console.log("Salon logo ", AdminSalonLogo)

  useEffect(() => {
    if (AdminSalonImages) {
      setSalonImages(AdminSalonImages);
    }
  }, [AdminSalonImages]);

  useEffect(() => {
    if (AdminSalonLogo) {
      setSalonLogo(AdminSalonLogo?.salonLogo[0]?.url);
    }
  }, [AdminSalonLogo]);

  const email = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminEmail
  );
  // const currentsalonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

  const SalonIconControllerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    SalonIconControllerRef.current = controller;

    dispatch(getAdminAllSalonIconAction(controller.signal));

    return () => {
      if (SalonIconControllerRef.current) {
        SalonIconControllerRef.current.abort();
      }
    };
  }, [dispatch]);

  const getAdminAllSalonIcon = useSelector(
    (state) => state.getAdminAllSalonIcon
  );

  const {
    loading: getAdminAllSalonIconLoading,
    resolve: getAdminAllSalonIconResolve,
    response: SalonIcons,
  } = getAdminAllSalonIcon;

  // console.log("Salon Icons ", SalonIcons)

  const SalonCategoriesRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    SalonIconControllerRef.current = controller;

    dispatch(getAllSalonCategoriesAction(controller.signal));

    return () => {
      if (SalonCategoriesRef.current) {
        SalonCategoriesRef.current.abort();
      }
    };
  }, [dispatch]);

  const getAllSalonCategories = useSelector(
    (state) => state.getAllSalonCategories
  );

  const {
    loading: getAllSalonCategoriesLoading,
    resolve: getAllSalonCategoriesResolve,
    response: salonCategories,
  } = getAllSalonCategories;

  // console.log("Edit Salon ", salonCategories)

  const [latitude, setLatitude] = useState(
    currentSalon?.location.coordinates.latitude
  );
  const [longitude, setLongitude] = useState(
    currentSalon?.location.coordinates.longitude
  );
  const [error, setError] = useState(null);

  // const geoLocationHandler = () => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         setLatitude(latitude);
  //         setLongitude(longitude);
  //       },
  //       (error) => {
  //         if (error.code === error.PERMISSION_DENIED) {
  //           setError("You denied access to your geolocation. Please enable it in your browser settings.");
  //         } else {
  //           setError("Error accessing geolocation: " + error.message);
  //         }
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not available in your browser.");
  //   }
  // }

  // console.log("Current Salon is ", currentSalon)

  const [salonEmail, setSalonEmail] = useState(currentSalon?.salonEmail);
  const [salonName, setSalonName] = useState(currentSalon?.salonName);
  const [salonDesc, setSalonDesc] = useState(currentSalon?.salonDesc);
  const [address, setAddress] = useState(currentSalon?.address);

  const [postCode, setPostCode] = useState(currentSalon?.postCode);
  const [contactTel, setContactTel] = useState(
    `${currentSalon?.mobileCountryCode}${currentSalon?.contactTel?.toString()}`
  );
  const [dialCode, setDialCode] = useState(currentSalon?.mobileCountryCode);
  // currentSalon?.contactTel
  const [webLink, setWebLink] = useState(currentSalon?.webLink);
  const [fbLink, setFbLink] = useState(currentSalon?.fbLink);
  const [twitterLink, setTwitterLink] = useState(currentSalon?.twitterLink);
  const [instraLink, setInstraLink] = useState(currentSalon?.instraLink);
  const [tiktokLink, setTiktokLink] = useState(currentSalon?.tiktokLink);

  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceEWT, setServiceEWT] = useState("");
  const [serviceCode, setServiceCode] = useState("");
  const [serviceId, setServiceId] = useState(0);
  const [serviceCategoryName, setServiceCategoryName] = useState("");

  const serviceCategoryNameHandler = (value) => {
    setServiceCategoryNameError("");
    setServiceCategoryName(value?.serviceCategoryName);
    setServiceCategoryOpen(false);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 8,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1250 },
      items: 7,
    },
    laptop: {
      breakpoint: { max: 1250, min: 768 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 768, min: 430 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 430, min: 0 },
      items: 3,
    },
  };

  const [salonType, setSalonType] = useState(currentSalon?.salonType);
  const [salonTypeDrop, setSalonTypeDrop] = useState(false);

  const [salonNameError, setSalonNameError] = useState("");
  const [salonDescError, setSalonDescError] = useState("");
  const [salonAddressError, setSalonAddressError] = useState("");
  const [invalidNumberError, setInvalidNumberError] = useState("");
  const [salonEmailError, setSalonEmailError] = useState("");

  const [serviceIconError, setServiceIconError] = useState("");
  const [serviceNameError, setServiceNameError] = useState("");
  const [serviceDescError, setServiceDescError] = useState("");
  const [servicePriceError, setServicePriceError] = useState("");
  const [serviceEwtError, setServiceEwtError] = useState("");
  const [serviceCategoryNameError, setServiceCategoryNameError] = useState("");

  const salonTypeDropHandler = () => {
    setSalonTypeDrop((prev) => !prev);
  };

  const salonTypeHandler = (value) => {
    setSalonType(value);
    setSalonTypeDrop(false);
  };

  const [countryCurrency, setCountryCurrency] = useState(
    currentSalon?.currency
  );

  const [country, setCountry] = useState(currentSalon?.country);
  const [countryDrop, setCountryDrop] = useState(false);
  const [countrycode, setCountryCode] = useState("");

  const setCountryHandler = (value) => {
    setCountryCode(value.countryCode);
    setCountry(value.name);
    setCountryCurrency(value.currency);
    setCountryDrop(false);
  };

  const [countryTimeout, setCountryTimeout] = useState(null);

  const debounceSearch = (value) => {
    if (countryTimeout) {
      clearTimeout(countryTimeout);
    }
    setCountry(value);

    setCountryTimeout(
      setTimeout(() => {
        dispatch(getAdminAllCountriesAction(value));
      }, 500)
    );
  };

  const searchCountryHandler = (e) => {
    const searchTerm = e.target.value;
    setCountryDrop(true);
    debounceSearch(searchTerm);
  };

  const getAdminAllCountries = useSelector(
    (state) => state.getAdminAllCountries
  );

  const {
    loading: getAdminAllCountriesLoading,
    resolve: getAdminAllCountriesResolve,
    response: AllCountries,
  } = getAdminAllCountries;

  const [city, setCity] = useState(currentSalon?.city);
  const [cityDrop, setCityDrop] = useState(false);

  const setCityHandler = (value) => {
    setCity(value.name);
    setCityDrop(false);
  };

  const [cityTimeout, setCityTimeout] = useState(null);

  const debounceCitySearch = (value, countrycode) => {
    if (cityTimeout) {
      clearTimeout(cityTimeout);
    }

    setCity(value);
    setCityTimeout(
      setTimeout(() => {
        dispatch(getAdminAllCitiesAction(value, countrycode));
      }, 500)
    );
  };

  const searchCityHandler = (e) => {
    const searchTerm = e.target.value;
    setCityDrop(true);
    debounceCitySearch(searchTerm, countrycode);
  };

  const getAdminAllCities = useSelector((state) => state.getAdminAllCities);

  const {
    loading: getAdminAllCitiesLoading,
    resolve: getAdminAllCitiesResolve,
    response: AllCities,
  } = getAdminAllCities;

  const [timezone, setTimezone] = useState(currentSalon?.timeZone);
  const [timezoneDrop, setTimezoneDrop] = useState(false);

  const timezoneDropHandler = () => {
    setTimezoneDrop((prev) => !prev);
  };

  const setTimezoneHandler = (value) => {
    setTimezone(value);
    setTimezoneDrop(false);
  };

  useEffect(() => {
    if (countrycode) {
      dispatch(getAdminAllTimezoneAction(countrycode));
    }
  }, [countrycode, dispatch]);

  const getAdminAllTimezone = useSelector((state) => state.getAdminAllTimezone);

  const {
    loading: getAdminAllTimezoneLoading,
    resolve: getAdminAllTimezoneResolve,
    response: AllTimezones,
  } = getAdminAllTimezone;

  const [vipService, setVipService] = useState(false);
  const [vipServiceDrop, setVipServiceDrop] = useState(false);

  const vipServiceDropHandler = () => {
    setVipServiceDrop((prev) => !prev);
  };

  const vipServiceHandler = (value) => {
    setVipService(value);
    setServiceTypeOpen(false);
  };

  const fileInputRef = useRef(null);

  const handleSalonLogoButtonClick = () => {
    fileInputRef.current.click();
  };

  const [uploadSalonLogo, setUploadSalonLogo] = useState("");

  const [editSalonLogoLoader, setEditSalonLogoLoader] = useState(false);

  const handleSalonFileInputChange = async (e) => {
    const uploadImage = e.target.files[0]; // Get the uploaded file

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
      // e.target.value = null;
      return;
    }

    const imageUrl = URL.createObjectURL(uploadImage);

    const formData = new FormData();

    formData.append("salonId", currentSalon?.salonId);
    formData.append("salonLogo", uploadImage);

    try {
      setEditSalonLogoLoader(true);
      const imageResponse = await api.post(
        "/api/salon/uploadSalonLogo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Salon logo uploaded successfully", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      // console.log('Salon Logo Upload success:', imageResponse.data);
      setSalonLogo(imageUrl);
      setEditSalonLogoLoader(false);

      dispatch(adminGetDefaultSalonAction(email));
    } catch (error) {
      // console.error('Image upload failed:', error);
      toast.error(error?.response?.data?.message, {
        duration: 3000,
        style: {
          fontSize: "1.4rem",
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      setEditSalonLogoLoader(false);
    }
  };

  const salonImagefileInputRef = useRef(null);

  const handleSalonImageButtonClick = () => {
    salonImagefileInputRef.current.click();
  };

  const [uploadSalonImageLoader, setUploadSalonImageLoader] = useState(false);

  const handleSalonImageFileInputChange = async (e) => {
    const uploadedFiles = e.target.files;
    const allowedTypes = ["image/jpeg", "image/webp", "image/png"];

    const invalidFiles = Array.from(uploadedFiles).filter(
      (file) => !allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
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

    const files = Array.from(uploadedFiles);

    const formData = new FormData();
    const SalonId = currentSalon?.salonId;
    formData.append("salonId", SalonId);

    files.forEach((file) => formData.append("gallery", file));

    try {
      setUploadSalonImageLoader(true);
      const { data } = await api.post("/api/salon/uploadSalonImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSalonImages([...data?.response, ...salonImages]);
      setUploadSalonImageLoader(false);

      toast.success("Salon images uploaded successfully", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      setUploadSalonImageLoader(false);
      if (error?.response?.status === 500) {
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

  const [selectedLogo, setSelectedLogo] = useState({
    url: "",
    public_id: "",
  });

  const logoselectHandler = (serviceImg) => {
    setServiceIconError("");
    setSelectedLogo({
      url: serviceImg.url,
      public_id: serviceImg.public_id,
    });
  };

  const [selectedServices, setSelectedServices] = useState(
    currentSalon?.services
  );

  const addServiceHandler = () => {
    if (!selectedLogo.url) {
      toast.error("Please select service icon", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServiceIconError("Please select service icon");
    }

    if (!serviceName) {
      toast.error("Please enter service name", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServiceNameError("Please enter service name");
    }

    if (serviceName.length < 1 || serviceName.length > 40) {
      toast.error("Service name must be between 1 to 40 charecters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      return setServiceNameError(
        "Service Name must be between 1 to 40 charecters"
      );
    }

    if (!serviceDesc) {
      toast.error("Please enter service description", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServiceDescError("Please enter service description");
    }

    if (serviceDesc.length < 1 || serviceDesc.length > 50) {
      toast.error("Service description must be between 1 to 50 charecters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServiceDescError(
        "Service description must be between 1 to 50 charecters"
      );
    }

    if (!serviceCategoryName) {
      toast.error("Please select service category", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServiceCategoryNameError("Please enter service category");
    }

    if (!servicePrice) {
      toast.error("Please enter service price", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServicePriceError("Please enter service price");
    }

    if (!serviceEWT) {
      toast.error("Please enter service EWT", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setServiceEwtError("Please enter service EWT");
    }

    const service = {
      serviceIcon: {
        url: selectedLogo.url,
        public_id: selectedLogo.public_id,
      },
      serviceName,
      servicePrice: Number(servicePrice),
      vipService,
      serviceDesc,
      serviceEWT: Number(serviceEWT),
      serviceId,
      serviceCode,
      serviceCategoryName,
    };

    setSelectedServices([...selectedServices, service]);

    setSelectedLogo({ url: "", public_id: "" });
    setServiceName("");
    setServicePrice("");
    setVipService(false);
    setServiceDesc("");
    setServiceEWT("");
    setServiceCode("");
    setServiceId(0);
  };

  const handleKeyPressAddServices = (e) => {
    if (e.key === "Enter") {
      addServiceHandler();
    }
  };

  const editServiceHandler = (index) => {
    const currentService = selectedServices[index];

    setSelectedLogo({
      url: currentService.serviceIcon.url,
      public_id: currentService.serviceIcon.public_id,
    });
    setServiceName(currentService.serviceName);
    setServicePrice(currentService.servicePrice);
    setVipService(currentService.vipService);
    setServiceDesc(currentService.serviceDesc);
    setServiceEWT(currentService.serviceEWT);
    setServiceCode(currentService.serviceCode);
    setServiceId(currentService.serviceId);
    setServiceCategoryName(currentService.serviceCategoryName);

    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);

    setSelectedServices(updatedServices);
  };

  const [deleteServiceLoader, setDeleteServiceLoader] = useState({
    serviceId: "",
    loading: false,
  });
  const deleteServiceHandler = async (service) => {
    const delete_data = {
      salonId: currentSalon?.salonId,
      serviceIds: [service?.serviceId],
    };

    try {
      setDeleteServiceLoader({
        serviceId: service?.serviceId,
        loading: true,
      });
      const { data } = await api.post(
        "/api/salon/deleteSalonServices",
        delete_data
      );

      toast.success(data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      navigate("/admin-salon");
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
      console.log("Error deleting salon service ", error);
    } finally {
      setDeleteServiceLoader({
        serviceId: "",
        loading: false,
      });
    }
  };

  const navigate = useNavigate();

  const [invalidnumber, setInvalidNumber] = useState(false);

  const editSalonHandler = () => {
    if (!salonName) {
      toast.error("Please enter salon name", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setSalonNameError("Please enter salon name");
    }

    if (salonName.length === 0 || salonName.length > 20) {
      toast.error("Salon Name must be between 1 to 20 characters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setSalonNameError("Salon Name must be between 1 to 20 characters");
    }

    if (!salonDesc) {
      toast.error("Please enter salon description", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setSalonDescError("Please enter salon description");
    }

    if (salonDesc.length === 0 || salonDesc.length > 35) {
      toast.error("Salon Description must be between 1 to 35 characters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setSalonDescError(
        "Salon Description must be between 1 to 35 characters"
      );
    }

    if (!address) {
      toast.error("Please enter salon address", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setSalonAddressError("Please enter salon address");
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

    const salondata = {
      adminEmail: email,
      salonEmail,
      salonName,
      salonDesc,
      address,
      location: {
        type: "Point",
        coordinates: {
          longitude: Number(longitude),
          latitude: Number(latitude),
        },
      },
      country,
      city,
      timeZone: timezone,
      postCode,
      contactTel: Number(contactTel),
      countryCode: Number(dialCode),
      salonType,
      webLink,
      fbLink,
      instraLink,
      twitterLink,
      tiktokLink,
      services: selectedServices,
      salonId: currentSalon?.salonId,
    };

    dispatch(adminEditSalonAction(salondata, navigate, email));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      editSalonHandler();
    }
  };

  const adminEditSalon = useSelector((state) => state.adminEditSalon);

  const { loading: editSalonLoading, response: editSalonResponse } =
    adminEditSalon;

  const [openModal, setOpenModal] = useState(false);

  const [selectedEditImageObject, setSelectedEditImageObject] = useState({});

  const selectedSalonImageClicked = async (imgObject) => {
    setSelectedEditImageObject(imgObject);
    setOpenModal(true);
  };

  const currentEditSalonImageInputRef = useRef(null);

  const handleCurrentEditSalonImageButtonClick = () => {
    currentEditSalonImageInputRef.current.click();
  };

  const [handleEditSalonLoader, setHandleEditSalonLoader] = useState(false);

  const handleEditSelectedImageFileInputChange = async (e) => {
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

    if (uploadImage != null) {
      const formData = new FormData();

      formData.append("public_imgid", selectedEditImageObject?.public_id);
      formData.append("id", selectedEditImageObject?._id);
      formData.append("gallery", uploadImage);
      formData.append("salonId", currentSalon?.salonId);

      try {
        setHandleEditSalonLoader(true);
        const { data: responseimage } = await api.put(
          "/api/salon/updateSalonImages",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (responseimage) {
          const updatedImages = salonImages.map((image) =>
            image._id === responseimage?.response?._id
              ? {
                  ...image,
                  public_id: responseimage?.response?.public_id,
                  url: responseimage?.response?.url,
                  _id: responseimage?.response?._id,
                }
              : image
          );
          setSalonImages(updatedImages);
          setOpenModal(false);
        }

        toast.success("Image updated successfully", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        setHandleEditSalonLoader(false);
      } catch (error) {
        if (error?.response?.status === 500) {
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

        toast.error(error?.response?.data?.message, {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        setHandleEditSalonLoader(false);
      }
    }
  };

  const deleteEditImageHandler = async (imgObj) => {
    if (window.confirm("Are you sure ?")) {
      try {
        const { data: responseimage } = await api.delete(
          "/api/salon/deleteSalonImages",
          {
            data: {
              public_id: imgObj?.public_id,
              img_id: imgObj?._id,
            },
          }
        );

        setSalonImages((images) =>
          images.filter((image) => image._id !== responseimage?.response?._id)
        );
        setOpenModal(false);

        toast.success("Image deleted successfully", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        if (error?.response?.status === 500) {
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
    }
  };

  const [openServices, setOpenServices] = useState(false);

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";

  const [openMobileUpdateModal, setOpenMobileUpdateModal] = useState(false);

  const mobiledeleteImage = async (imgObj) => {
    if (window.confirm("Are you sure ?")) {
      try {
        const { data: responseimage } = await api.delete(
          "/api/salon/deleteSalonImages",
          {
            data: {
              public_id: imgObj?.public_id,
              img_id: imgObj?._id,
            },
          }
        );

        setSalonImages((images) =>
          images.filter((image) => image._id !== responseimage?.response?._id)
        );

        toast.success("Image deleted successfully", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        if (error?.response?.status === 500) {
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
    }
  };

  const [selectedMobileEditImageObject, setSelectedMobileEditImageObject] =
    useState({});

  const mobileEditSalonImageInputRef = useRef(null);

  const handleCurrentMobileEditSalonImageButtonClick = (imgObj) => {
    mobileEditSalonImageInputRef.current.click();
    setSelectedMobileEditImageObject(imgObj);
  };

  const [mobileEditSelectedimageLoader, setMobileEditSelectedImageLoader] =
    useState(false);

  const mobileEditSelectedImageFileInputChange = async (e) => {
    const uploadImage = e.target.files[0];

    const allowedTypes = ["image/jpeg", "image/webp", "image/png"];

    if (!allowedTypes.includes(uploadImage.type)) {
      alert("Please upload a valid image file (JPEG, WebP, PNG).");
      return;
    }

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

    if (uploadImage != null) {
      const formData = new FormData();

      formData.append("public_imgid", selectedMobileEditImageObject?.public_id);
      formData.append("id", selectedMobileEditImageObject?._id);
      formData.append("gallery", uploadImage);
      formData.append("salonId", currentSalon?.salonId);

      try {
        setMobileEditSelectedImageLoader(selectedMobileEditImageObject._id);

        const { data: responseimage } = await api.put(
          "/api/salon/updateSalonImages",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (responseimage) {
          const updatedImages = salonImages.map((image) =>
            image._id === responseimage?.response?._id
              ? {
                  ...image,
                  public_id: responseimage?.response?.public_id,
                  url: responseimage?.response?.url,
                  _id: responseimage?.response?._id,
                }
              : image
          );
          setSalonImages(updatedImages);
        }

        toast.success("Image updated successfully", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });

        setMobileEditSelectedImageLoader(null);
      } catch (error) {
        if (error?.response?.status === 500) {
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

        toast.error(error?.response?.data?.message, {
          duration: 3000,
          style: {
            fontSize: "1.4rem",
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        setMobileEditSelectedImageLoader(null);
      }
    }
  };

  const addservicedropHandler = () => {
    if (country == "") {
      toast.error("Please select a country", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      setOpenServices((prev) => !prev);
    }
  };

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  const [countryflag, setCountryFlag] = useState("gb");

  const handlePhoneChange = (phone, meta) => {
    setInvalidNumberError("");
    const { country, inputValue } = meta;

    const isValid = isPhoneValid(phone);

    if (isValid) {
      setContactTel(phone);
      setDialCode(country?.dialCode);
      setCountryFlag(country?.iso2);
      setInvalidNumber(false);
    } else {
      setInvalidNumber(true);
    }
  };

  // =======================================

  const steps = [
    {
      label: "Account Information",
      fields: [
        {
          name: "name",
          label: "Salon Name",
          type: "text",
          placeholder: "Enter salon name",
          value: salonName,
          onChange: (e) => {
            setSalonNameError("");
            setSalonName(e.target.value);
          },
          error: salonNameError,
        },
        {
          name: "description",
          label: "Salon Description",
          type: "text",
          placeholder: "Enter salon description",
          value: salonDesc,
          onChange: (e) => {
            setSalonDescError("");
            setSalonDesc(e.target.value);
          },
          error: salonDescError,
        },
        {
          name: "email",
          label: "Salon Email",
          type: "text",
          placeholder: "Enter salon email",
          value: salonEmail,
          onChange: (e) => {
            setSalonEmailError("");
            setSalonEmail(e.target.value);
          },
          error: salonEmailError,
        },
        {
          name: "contactTel",
          label: "Salon Mobile Number",
          type: "text",
          placeholder: "Enter salon mobile number",
        },
      ],
    },
    {
      label: "Business Information",
      fields: [
        {
          name: "businesstype",
          label: "Salon Business Type",
          type: "text",
          dropdown: true,
          placeholder: "Select business type",
          value: salonType,
          readOnly: true,
        },
        {
          name: "address",
          label: "Salon Address",
          type: "text",
          dropdown: false,
          placeholder: "Enter salon address",
          value: address,
          onChange: (e) => {
            setSalonAddressError("");
            setAddress(e.target.value);
          },
          error: salonAddressError,
        },
        {
          name: "postcode",
          label: "Salon Post Code",
          type: "text",
          dropdown: false,
          placeholder: "Enter salon postcode",
          value: postCode,
          readOnly: true,
        },
        {
          name: "lattitude",
          label: "Latitude",
          type: "text",
          dropdown: false,
          placeholder: "Lattiude",
          value: latitude,
          readOnly: true,
        },
        {
          name: "longitude",
          label: "Longitude",
          type: "text",
          dropdown: false,
          placeholder: "Longitude",
          value: longitude,
          readOnly: true,
        },
        {
          name: "country",
          label: "Country",
          type: "text",
          dropdown: false,
          placeholder: "Select country",
          value: country,
          readOnly: true,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          dropdown: false,
          placeholder: "Select city",
          value: city,
          readOnly: true,
        },
        {
          name: "timezone",
          label: "Timezone",
          type: "text",
          dropdown: false,
          placeholder: "Select timezone",
          value: timezone,
          readOnly: true,
        },
      ],
    },
    {
      label: "Select Services",
      fields: [
        { name: "serviceicon", label: "Service Icon", error: serviceIconError },
        {
          name: "servicename",
          label: "Service Name",
          type: "text",
          placeholder: "Enter your service name",
          dropdown: false,
          value: serviceName,
          onChange: (e) => {
            setServiceNameError("");
            setServiceName(e.target.value);
          },
          error: serviceNameError,
        },
        {
          name: "servicedescription",
          label: "Service Description",
          type: "text",
          placeholder: "Enter your service description",
          dropdown: false,
          value: serviceDesc,
          onChange: (e) => {
            setServiceDescError("");
            setServiceDesc(e.target.value);
          },
          error: serviceDescError,
        },
        {
          name: "servicetype",
          label: "Service Type (*VIP services have top priority in queue)",
          type: "text",
          placeholder: "Select Service Type",
          dropdown: true,
          value: `${vipService ? "VIP" : "Regular"}`,
        },
        {
          name: "serviceCategory",
          label: "Service Category",
          type: "text",
          placeholder: "Select Service Category",
          dropdown: true,
          value: serviceCategoryName,
          error: serviceCategoryNameError,
        },

        {
          name: "serviceprice",
          label: "Service Price",
          type: "text",
          placeholder: "Enter your service price",
          dropdown: false,
          value: servicePrice,
          onChange: (e) => {
            setServicePriceError("");
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setServicePrice(value);
            }
          },
          error: servicePriceError,
        },
        {
          name: "serviceewt",
          label: "Service Estimated Time (mins)",
          type: "text",
          placeholder: "Enter your service estimated time",
          dropdown: false,
          value: serviceEWT,
          onChange: (e) => {
            setServiceEwtError("");
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setServiceEWT(value);
            }
          },
          error: serviceEwtError,
        },
      ],
    },
    {
      label: "Gallery",
      fields: [],
    },
    {
      label: "Social Links",
      fields: [
        {
          name: "website",
          type: "text",
          placeholder: "Website URL",
          icon: <WebsiteIcon />,
          value: webLink,
          onChange: (e) => setWebLink(e.target.value),
        },
        {
          name: "facebook",
          type: "text",
          placeholder: "Facebook URL",
          icon: <FacebookIcon />,
          value: fbLink,
          onChange: (e) => setFbLink(e.target.value),
        },
        {
          name: "instagram",
          type: "text",
          placeholder: "Instagram URL",
          icon: <InstagramIcon />,
          value: instraLink,
          onChange: (e) => setInstraLink(e.target.value),
        },
        {
          name: "x",
          type: "text",
          placeholder: "X URL",
          icon: <XIcon />,
          value: twitterLink,
          onChange: (e) => setTwitterLink(e.target.value),
        },
        {
          name: "titkok",
          type: "text",
          placeholder: "Tiktok URL",
          icon: <TiktokIcon />,
          value: tiktokLink,
          onChange: (e) => setTiktokLink(e.target.value),
        },
      ],
    },
  ];

  const [activeStep, setActiveStep] = useState(2);
  const [formData, setFormData] = useState({
    accountInfo: "",
    projectID: "",
    ownerName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const [AllSteps, setAllSteps] = useState({
    step1: true,
    step2: true,
    step3: true,
    step4: false,
    step5: false,
  });

  const handleNext = () => {
    if (activeStep === 0) {
      if (!salonName) {
        toast.error("Please enter salon name", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setSalonNameError("Please enter salon name");
      }

      if (salonName?.length === 0 || salonName?.length > 20) {
        toast.error("Salon Name must be between 1 to 20 characters", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setSalonNameError(
          "Salon Name must be between 1 to 20 characters"
        );
      }

      if (!salonDesc) {
        toast.error("Please enter salon description", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setSalonDescError("Please enter salon description");
      }

      if (salonDesc.length === 0 || salonDesc.length > 35) {
        toast.error("Salon Description must be between 1 to 35 characters", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setSalonDescError(
          "Salon Description must be between 1 to 35 characters"
        );
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

      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      setAllSteps((prev) => {
        return { ...prev, step1: true };
      });
    } else if (activeStep === 1) {
      if (!salonType) {
        toast.error("Please select salon type", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setSalonTypeError("Please select salon type");
      }

      if (!address) {
        toast.error("Please enter salon address", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
        return setSalonAddressError("Please enter salon address");
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      setAllSteps((prev) => {
        return { ...prev, step2: true };
      });
    } else if (activeStep === 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      setAllSteps((prev) => {
        return { ...prev, step3: true };
      });
    } else if (activeStep === 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      setAllSteps((prev) => {
        return { ...prev, step4: true };
      });
    } else if (activeStep === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      setAllSteps((prev) => {
        return { ...prev, step5: true };
      });
    }
  };

  const handleStepClicked = (index) => {
    if (AllSteps[`step${index + 1}`]) {
      setActiveStep(index);
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

  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [serviceTypeOpen, setServiceTypeOpen] = useState(false);
  const [serviceCategoryOpen, setServiceCategoryOpen] = useState(false);

  // React Map logic

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = React.useState(null);

  const [center, setCenter] = useState({
    lat: currentSalon?.location.coordinates.latitude,
    lng: currentSalon?.location.coordinates.longitude,
  });

  const onLoad = React.useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Set marker position to clicked location
    setMarkerPosition({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);

    // const existingData = JSON.parse(localStorage.getItem("salondata")) || {};
    // localStorage.setItem("salondata", JSON.stringify({
    //   ...existingData,
    //   ["latitude"]: lat,
    //   ["longitude"]: lng
    // }));
  };

  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Edit Salon</h2>
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
              <StepLabel
                onClick={() => {
                  handleStepClicked(index);
                }}
              >
                <span className={`${style.stepper_heading}`}>{step.label}</span>
              </StepLabel>

              {step.label === "Account Information" && (
                <StepContent>
                  <main className={`${style.form_container}`}>
                    {step.fields.map((field) => (
                      <div key={field.name} className={`${style.form_group}`}>
                        <label>{field.label}</label>

                        {field.name === "contactTel" ? (
                          <>
                            <PhoneInput
                              forceDialCode={true}
                              defaultCountry={countryflag}
                              value={contactTel}
                              onChange={(phone, meta) =>
                                handlePhoneChange(phone, meta)
                              }
                            />
                            {invalidNumberError ? (
                              <p style={{ color: "red", fontSize: "1.4rem" }}>
                                {invalidNumberError}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <input
                              type={field.type}
                              name={field.name}
                              value={field.value}
                              placeholder={field.placeholder}
                              onChange={field.onChange}
                            />
                            {field?.error ? (
                              <p style={{ color: "red", fontSize: "1.4rem" }}>
                                {field?.error}
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

              {step.label === "Business Information" && (
                <StepContent>
                  <main className={`${style.form_container}`}>
                    {step.fields.map((field) => (
                      <div key={field.name} className={`${style.form_group}`}>
                        <label>{field.label}</label>

                        {field.dropdown ? (
                          <div
                            className={`${style.select_container}`}
                            onClick={() => setBusinessTypeOpen((prev) => !prev)}
                          >
                            <input
                              type={field.type}
                              name={field.name}
                              value={field.value}
                              placeholder={field.placeholder}
                              readOnly={field?.readOnly}
                            />
                            <div>
                              <DropdownIcon />
                            </div>

                            {businessTypeOpen ? (
                              <ClickAwayListener
                                onClickAway={() => setBusinessTypeOpen(false)}
                              >
                                <div
                                  className={`${style.select_dropdown_container}`}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    onClick={() =>
                                      salonTypeHandler("Barber Shop")
                                    }
                                  >
                                    Barber Shop
                                  </button>
                                  <button
                                    onClick={() =>
                                      salonTypeHandler("Hair Dresser")
                                    }
                                  >
                                    Hair Dresser
                                  </button>
                                </div>
                              </ClickAwayListener>
                            ) : null}
                          </div>
                        ) : (
                          <>
                            <input
                              type={field.type}
                              name={field.name}
                              value={field.value}
                              placeholder={field.placeholder}
                              readOnly={field?.readOnly}
                              onChange={field?.onChange}
                            />
                            {field?.error ? (
                              <p style={{ color: "red", fontSize: "1.4rem" }}>
                                {field?.error}
                              </p>
                            ) : null}
                          </>
                        )}

                        {field.name === "longitude" && (
                          <>
                            <p style={{ fontWeight: 700 }}>
                              * Update your salon's exact location on the map to
                              automatically set its latitude and longitude.
                            </p>
                            <div
                              style={{
                                height: "30rem",
                                backgroundColor: "#efefef",
                                borderRadius: "0.6rem",
                                overflow: "hidden",
                              }}
                            >
                              {isLoaded ? (
                                <GoogleMap
                                  mapContainerStyle={{
                                    width: "100%",
                                    height: "30rem",
                                  }}
                                  center={center}
                                  zoom={10}
                                  onLoad={onLoad}
                                  onUnmount={onUnmount}
                                  onClick={handleMapClick}
                                  options={{
                                    disableDefaultUI: false, // Keep basic controls like zoom
                                    streetViewControl: false, // 🚫 Remove Pegman / Street View
                                    mapTypeControl: false, // 🚫 Remove Satellite / Terrain switcher
                                    fullscreenControl: true, // ✅ Keep fullscreen option if needed
                                    zoomControl: true, // ✅ Keep zoom buttons
                                  }}
                                >
                                  {markerPosition && (
                                    <OverlayView
                                      position={markerPosition}
                                      mapPaneName={
                                        OverlayView.OVERLAY_MOUSE_TARGET
                                      }
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          transform: "translate(-50%, -100%)",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "5rem",
                                            height: "5rem",
                                            borderRadius: "0.6rem",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <img
                                            src="/mapPointer.png"
                                            alt=""
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </div>

                                        <div
                                          style={{
                                            marginTop: "0.8rem",
                                            backgroundColor: "#fff",
                                            padding: "0.4rem 0.8rem",
                                            borderRadius: "0.4rem",
                                            boxShadow:
                                              "0 2px 6px rgba(0,0,0,0.2)",
                                            fontSize: "1.4rem",
                                            fontWeight: "bold",
                                            color: "#333",
                                            whiteSpace: "nowrap",
                                            border: "0.1rem solid #ccc",
                                          }}
                                        >
                                          {salonName}
                                        </div>
                                      </div>
                                    </OverlayView>
                                  )}
                                </GoogleMap>
                              ) : (
                                <></>
                              )}
                            </div>
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

                    <button onClick={handleBack} disabled={index === 0}>
                      Back
                    </button>
                  </main>
                </StepContent>
              )}

              {step.label === "Select Services" && (
                <StepContent>
                  <main className={`${style.service_container}`}>
                    <div>
                      <div>
                        {step.fields.map((field) => (
                          <div
                            key={field.name}
                            className={`${style.form_group}`}
                          >
                            {getAdminAllSalonIconResolve && (
                              <label>{field.label}</label>
                            )}
                            {field.name === "serviceicon" ? (
                              <>
                                {getAdminAllSalonIconResolve && (
                                  <div className={style.service_icon_container}>
                                    <Carousel
                                      responsive={responsive}
                                      draggable={false}
                                      swipeable={false}
                                    >
                                      {SalonIcons?.map((s) => (
                                        <div
                                          key={s?._id}
                                          className={`${style.slider_item} ${
                                            selectedLogo?.url === s?.url &&
                                            style.icon_selected
                                          } ${darkmodeOn && style.dark}`}
                                          onClick={() => logoselectHandler(s)}
                                          style={{
                                            border:
                                              field.error && "0.1rem solid red",
                                          }}
                                        >
                                          <img src={s?.url} alt="" />
                                        </div>
                                      ))}
                                    </Carousel>
                                  </div>
                                )}

                                {field.error ? (
                                  <p
                                    style={{ color: "red", fontSize: "1.4rem" }}
                                  >
                                    {field.error}
                                  </p>
                                ) : null}
                              </>
                            ) : field.name === "servicetype" ? (
                              <div
                                className={`${style.select_container}`}
                                onClick={() =>
                                  setServiceTypeOpen((prev) => !prev)
                                }
                              >
                                <input
                                  type={field.type}
                                  name={field.name}
                                  value={field.value}
                                  placeholder={field.placeholder}
                                  readOnly
                                />
                                <div>
                                  <DropdownIcon />
                                </div>

                                {serviceTypeOpen && (
                                  <ClickAwayListener
                                    onClickAway={() =>
                                      setServiceTypeOpen(false)
                                    }
                                  >
                                    <div
                                      className={`${style.select_dropdown_container}`}
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                    >
                                      <button
                                        onClick={() => vipServiceHandler(false)}
                                      >
                                        Regular
                                      </button>
                                      <button
                                        onClick={() => vipServiceHandler(true)}
                                      >
                                        VIP
                                      </button>
                                    </div>
                                  </ClickAwayListener>
                                )}
                              </div>
                            ) : field.name === "serviceCategory" ? (
                              <>
                                <div
                                  className={`${style.select_container}`}
                                  onClick={() =>
                                    setServiceCategoryOpen((prev) => !prev)
                                  }
                                >
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    value={field.value}
                                    placeholder={field.placeholder}
                                    readOnly
                                  />
                                  <div>
                                    <DropdownIcon />
                                  </div>

                                  {serviceCategoryOpen && (
                                    <ClickAwayListener
                                      onClickAway={() =>
                                        setServiceCategoryOpen(false)
                                      }
                                    >
                                      <div
                                        className={`${style.select_dropdown_container}`}
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                      >
                                        {salonCategories?.map((item) => {
                                          return (
                                            <button
                                              onClick={() =>
                                                serviceCategoryNameHandler(item)
                                              }
                                              key={item?._id}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                              }}
                                            >
                                              <img
                                                src={
                                                  item?.serviceCategoryImage
                                                    ?.url
                                                }
                                                alt={item?.serviceCategoryName}
                                                style={{
                                                  width: "2.4rem",
                                                  height: "2.4rem",
                                                  objectFit: "cover",
                                                  borderRadius: "50%",
                                                  border:
                                                    "0.1rem solid #efefef",
                                                }}
                                              />
                                              {item?.serviceCategoryName}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </ClickAwayListener>
                                  )}
                                </div>
                                {field.error ? (
                                  <p
                                    style={{ color: "red", fontSize: "1.4rem" }}
                                  >
                                    {field.error}
                                  </p>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <input
                                  type={field.type}
                                  name={field.name}
                                  value={field.value}
                                  placeholder={field.placeholder}
                                  onChange={field.onChange}
                                />
                                {field.error ? (
                                  <p
                                    style={{ color: "red", fontSize: "1.4rem" }}
                                  >
                                    {field.error}
                                  </p>
                                ) : null}
                              </>
                            )}
                          </div>
                        ))}

                        {/* <button className={style.add_service_btn} onClick={addServiceHandler}>Add Service</button> */}

                        <div className={`${style.button_container}`}>
                          <button
                            onClick={addServiceHandler}
                            disabled={index === 0}
                          >
                            Add Service
                          </button>
                          <button
                            onClick={handleNext}
                            disabled={selectedServices?.length === 0}
                            style={{
                              cursor:
                                selectedServices?.length === 0
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {index === steps.length - 1 ? "Finish" : "Continue"}
                          </button>
                        </div>

                        <button onClick={handleBack} disabled={index === 0}>
                          Back
                        </button>
                      </div>

                      <div
                        style={{
                          display: selectedServices?.length ? "block" : "none",
                          padding: selectedServices?.length ? "1rem" : "0rem",
                        }}
                      >
                        {selectedServices?.map((ser, index) => {
                          return (
                            <div
                              className={style.mobile_service_item}
                              key={index}
                            >
                              <div>
                                <div>
                                  <div>
                                    <img
                                      src={ser?.serviceIcon.url || ""}
                                      alt=""
                                    />

                                    {ser.vipService ? (
                                      <span>
                                        <CrownIcon />
                                      </span>
                                    ) : null}
                                  </div>

                                  <p>{ser.serviceName}</p>
                                  <p>{ser.serviceDesc}</p>
                                  <p>{ser.serviceCategoryName}</p>
                                </div>

                                <div>
                                  <button
                                    onClick={() => editServiceHandler(index)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => deleteServiceHandler(ser)}
                                    disabled={deleteServiceLoader?.loading}
                                  >
                                    {deleteServiceLoader?.loading && deleteServiceLoader.serviceId === ser.serviceId ? (
                                      <ButtonLoader />
                                    ) : (
                                      "Delete"
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div>
                                  <p>Price</p>
                                  {/* <p>{countryCurrency}{" "} {ser.servicePrice}</p> */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <p>{countryCurrency}</p>
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      value={ser.servicePrice}
                                      maxLength={6}
                                      style={{
                                        width: "6rem",
                                        outline: "none",
                                        backgroundColor: "transparent",
                                        padding: "0.4rem",
                                        fontSize: "1.4rem",
                                        border: "none",
                                        borderBottom:
                                          "0.1rem solid var(--text-primary)",
                                        textAlign: "center",
                                      }}
                                      onChange={(e) => {
                                        let value = e.target.value.trim();

                                        // ✅ Allow only numbers and at most one decimal point
                                        if (!/^\d*\.?\d*$/.test(value)) return;

                                        // ✅ Prevent multiple leading zeros (e.g., 000 or 012)
                                        if (
                                          value.length > 1 &&
                                          value[0] === "0" &&
                                          value[1] !== "."
                                        ) {
                                          value = value.replace(/^0+/, "");
                                        }

                                        // ✅ Prevent negative numbers
                                        if (value.startsWith("-")) return;

                                        // ✅ Optional: Limit to 2 decimal places
                                        const decimalIndex = value.indexOf(".");
                                        if (
                                          decimalIndex !== -1 &&
                                          value.length - decimalIndex > 3
                                        )
                                          return;

                                        // ✅ Update state
                                        setSelectedServices((prev) =>
                                          prev.map((item, idx) =>
                                            idx === index
                                              ? { ...item, servicePrice: value }
                                              : item
                                          )
                                        );
                                      }}
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <p>Estimated Time</p>

                                  <input
                                    type="text"
                                    value={ser.serviceEWT}
                                    maxLength={3}
                                    style={{
                                      width: "6rem",
                                      outline: "none",
                                      backgroundColor: "transparent",
                                      padding: "0.4rem",
                                      fontSize: "1.4rem",
                                      border: "none",
                                      borderBottom:
                                        "0.1rem solid var(--text-primary)",
                                      textAlign: "center",
                                    }}
                                    onChange={(e) => {
                                      const newValue = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      ); // Allow only digits

                                      const numericValue =
                                        newValue === "" ? "" : Number(newValue);

                                      // ✅ Update state
                                      setSelectedServices((prev) =>
                                        prev.map((item, idx) =>
                                          idx === index
                                            ? {
                                                ...item,
                                                serviceEWT: numericValue,
                                              }
                                            : item
                                        )
                                      );
                                    }}
                                  />
                                  {/* <p>{ser.serviceEWT} mins</p> */}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {selectedServices?.map((ser, index) => {
                          return (
                            <div className={style.service_item} key={index}>
                              <div>
                                <div>
                                  <div>
                                    <img
                                      src={ser?.serviceIcon.url || ""}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <p>{ser.serviceName}</p>
                                    <p>{ser.vipService ? "VIP" : "Regular"}</p>
                                    <p>{ser.serviceDesc}</p>
                                    <p>{ser.serviceCategoryName}</p>
                                  </div>
                                </div>

                                <div>
                                  <button
                                    onClick={() => editServiceHandler(index)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => deleteServiceHandler(ser)}
                                    disabled={deleteServiceLoader?.loading}
                                  >
                                    {deleteServiceLoader?.loading && deleteServiceLoader.serviceId === ser.serviceId ? (
                                      <ButtonLoader />
                                    ) : (
                                      "Delete"
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div>
                                  <p>Price</p>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <p>{countryCurrency}</p>
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      value={ser.servicePrice}
                                      maxLength={6}
                                      style={{
                                        width: "6rem",
                                        outline: "none",
                                        textAlign: "center",
                                        backgroundColor: "transparent",
                                        padding: "0.4rem",
                                        fontSize: "1.4rem",
                                        border: "none",
                                        borderBottom:
                                          "0.1rem solid var(--text-primary)",
                                      }}
                                      onChange={(e) => {
                                        let value = e.target.value.trim();

                                        // ✅ Allow only numbers and at most one decimal point
                                        if (!/^\d*\.?\d*$/.test(value)) return;

                                        // ✅ Prevent multiple leading zeros (e.g., 000 or 012)
                                        if (
                                          value.length > 1 &&
                                          value[0] === "0" &&
                                          value[1] !== "."
                                        ) {
                                          value = value.replace(/^0+/, "");
                                        }

                                        // ✅ Prevent negative numbers
                                        if (value.startsWith("-")) return;

                                        // ✅ Optional: Limit to 2 decimal places
                                        const decimalIndex = value.indexOf(".");
                                        if (
                                          decimalIndex !== -1 &&
                                          value.length - decimalIndex > 3
                                        )
                                          return;

                                        // ✅ Update state
                                        setSelectedServices((prev) =>
                                          prev.map((item, idx) =>
                                            idx === index
                                              ? { ...item, servicePrice: value }
                                              : item
                                          )
                                        );
                                      }}
                                      placeholder="0.00"
                                    />
                                  </div>

                                  {/* <p>{countryCurrency}{" "} {ser.servicePrice}</p> */}
                                </div>

                                <div>
                                  <p>Estimated Time</p>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={ser.serviceEWT}
                                      maxLength={3}
                                      style={{
                                        width: "6rem",
                                        outline: "none",
                                        backgroundColor: "transparent",
                                        padding: "0.4rem",
                                        fontSize: "1.4rem",
                                        border: "none",
                                        borderBottom:
                                          "0.1rem solid var(--text-primary)",
                                        textAlign: "center",
                                      }}
                                      onChange={(e) => {
                                        const newValue = e.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                        ); // Allow only digits

                                        const numericValue =
                                          newValue === ""
                                            ? ""
                                            : Number(newValue);

                                        // ✅ Update state
                                        setSelectedServices((prev) =>
                                          prev.map((item, idx) =>
                                            idx === index
                                              ? {
                                                  ...item,
                                                  serviceEWT: numericValue,
                                                }
                                              : item
                                          )
                                        );
                                      }}
                                    />
                                    <p>mins</p>
                                  </div>

                                  {/* <p>{ser.serviceEWT} mins</p> */}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </main>
                </StepContent>
              )}

              {step.label === "Gallery" && (
                <StepContent>
                  <main className={`${style.gallery_container} `}>
                    <div>
                      <div>
                        <p>Upload your salon's logo</p>
                        <button onClick={() => handleSalonLogoButtonClick()}>
                          Upload
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleSalonFileInputChange}
                        />
                      </div>

                      <div>
                        <img src={salonLogo} alt="" />
                      </div>
                    </div>

                    <div>
                      <div>
                        <p>
                          Please select high-quality images to showcase your
                          salon.
                        </p>
                        <button
                          onClick={() => handleSalonImageButtonClick()}
                          disabled={uploadSalonImageLoader}
                        >
                          upload
                        </button>
                        <input
                          type="file"
                          ref={salonImagefileInputRef}
                          style={{ display: "none" }}
                          multiple
                          onChange={handleSalonImageFileInputChange}
                        />
                      </div>

                      <div
                        style={{
                          display: salonImages?.length ? "block" : "none",
                          padding: salonImages?.length ? "1.5rem" : "0rem",
                        }}
                      >
                        {salonImages.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onClick={() => selectedSalonImageClicked(item)}
                            >
                              <img src={item?.url} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`${style.button_container} `}>
                      <button onClick={handleBack} disabled={index === 0}>
                        Back
                      </button>
                      <button onClick={handleNext}>
                        {index === steps.length - 1 ? "Finish" : "Continue"}
                      </button>
                    </div>
                  </main>
                </StepContent>
              )}

              {step.label === "Social Links" && (
                <StepContent>
                  <main className={`${style.social_link_container} `}>
                    {step.fields.map((field) => (
                      <div key={field.name} className={`${style.form_group} `}>
                        <div>
                          <div>{field.icon}</div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={field.onChange}
                          />
                        </div>
                      </div>
                    ))}
                    <div className={`${style.button_container} `}>
                      <button onClick={handleBack} disabled={index === 0}>
                        Back
                      </button>
                      <button onClick={handleNext}>
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
          <div className={`${style.complete} `}>
            <p>
              All steps have been successfully completed. Please click the{" "}
              <span
                style={{ color: "var(--bg-secondary)", fontWeight: "bold" }}
              >
                Update
              </span>{" "}
              button to save your changes.
            </p>
            <div>
              <button onClick={handleBack}>Back</button>
              {editSalonLoading ? (
                <button
                  style={{
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <ButtonLoader />
                </button>
              ) : (
                <button onClick={editSalonHandler}>Update</button>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className={`${style.modal_container} ${darkmodeOn && style.dark} `}
        >
          <div>
            <p>Selected Image</p>
            <button onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className={style.modal_content_container}>
            {handleEditSalonLoader ? (
              <div>
                <Skeleton
                  width={"100%"}
                  height={"100%"}
                  baseColor={"var(--loader-bg-color)"}
                  highlightColor={"var(--loader-highlight-color)"}
                />
              </div>
            ) : (
              <div>
                <img src={selectedEditImageObject?.url} alt="salon image" />
              </div>
            )}

            <div>
              <div>
                <button
                  onClick={() => handleCurrentEditSalonImageButtonClick()}
                  disabled={handleEditSalonLoader}
                >
                  Update
                  <input
                    type="file"
                    ref={currentEditSalonImageInputRef}
                    style={{ display: "none" }}
                    onChange={handleEditSelectedImageFileInputChange}
                  />
                </button>
                <button
                  onClick={() =>
                    deleteEditImageHandler(selectedEditImageObject)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default EditSalon;
