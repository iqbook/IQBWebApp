// import React, { useEffect, useRef, useState } from 'react';
// import style from './SalonAdv.module.css';
// import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
// import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { CloseIcon, DeleteIcon, EditIcon, FaFileIcon, FileImage, Uploadicon } from '../../icons'
// import { useSelector } from 'react-redux';
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import { useDispatch } from 'react-redux';
// import { adminDragAdvertisementAction, getAllAdvertisementAction } from '../../Redux/Admin/Actions/DashboardAction'
// import api from '../../Redux/api/Api';
// import ButtonLoader from '../../components/ButtonLoader/ButtonLoader'
// import Skeleton from 'react-loading-skeleton';
// import toast from 'react-hot-toast';
// import { Carousel } from 'react-responsive-carousel';
// import { Modal } from '@mui/material';

// const SalonAdv = () => {
//   const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

//   const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

//   const advImagefileInputRef = useRef(null);

//   const handleAdvImageButtonClick = () => {
//     advImagefileInputRef.current.click();
//   };

//   const [uploadAdvImages, setUploadAdvImages] = useState([])

//   const handleAdvImageFileInputChange = async (e) => {
//     const uploadedFiles = e.target.files;
//     const allowedTypes = ["image/jpeg", "image/webp", "image/png"];

//     // Check for invalid files
//     const invalidFiles = Array.from(uploadedFiles).filter(file => !allowedTypes.includes(file.type));
//     if (invalidFiles.length > 0) {
//       toast.error("Please upload only valid image files (JPEG, WebP, PNG).", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       setUploadAdvImages([]);
//       return;
//     }

//     // Only process valid files
//     const validFiles = Array.from(uploadedFiles).filter(file => allowedTypes.includes(file.type));

//     if (validFiles.length > 5) {
//       toast.error("Cannot upload more than 5 images at once", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       setUploadAdvImages([]);
//       return;
//     }

//     const newUploadAdvImages = validFiles.map((file) => ({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       lastModified: file.lastModified,
//       link: "",
//       file
//     }));

//     setUploadAdvImages(newUploadAdvImages);
//     // setUploadAdvImages(validFiles)

//     setSalonAdvModal(true)
//   };

//   // console.log("Uploaded Adv Images: ", uploadAdvImages)

//   const fileLinkChangeHandler = (e, item) => {
//     const updatedImages = uploadAdvImages.map((image) => {
//       if (image.lastModified === item.lastModified) {
//         return { ...image, link: e.target.value };
//       }
//       return image;
//     });

//     setUploadAdvImages(updatedImages);
//   }

//   const dispatch = useDispatch()

//   const advertisementcontrollerRef = useRef(new AbortController());

//   useEffect(() => {
//     const controller = new AbortController();
//     advertisementcontrollerRef.current = controller;

//     dispatch(getAllAdvertisementAction(salonId, controller.signal));

//     return () => {
//       if (advertisementcontrollerRef.current) {
//         advertisementcontrollerRef.current.abort();
//       }
//     };
//   }, [salonId, dispatch]);

//   const getAllAdvertisement = useSelector(state => state.getAllAdvertisement)

//   const {
//     loading: getAllAdvertisementLoading,
//     resolve: getAllAdvertisementResolve,
//     advertisements
//   } = getAllAdvertisement

//   const [uploadLoader, setUploadLoader] = useState(false)

//   // console.log("uploadAdvImages ", uploadAdvImages)

//   const uploadAdvHandler = async () => {
//     if (uploadAdvImages.length > 0) {
//       const formData = new FormData();

//       formData.append('salonId', salonId);
//       formData.append('advertisementLink', JSON.stringify(uploadAdvImages))

//       for (const file of uploadAdvImages) {
//         console.log("hhhh ", file.file)
//         formData.append('advertisements', file.file);
//       }

//       try {
//         setUploadLoader(true)
//         const imageResponse = await api.post('/api/advertisement/addAdvertisements', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         setUploadLoader(false)
//         setUploadAdvImages([]);
//         dispatch({
//           type: "ADD_ADVETISEMENT",
//           payload: imageResponse?.data?.response
//         })
//         toast.success("Advertisement uploaded successfully", {
//           duration: 3000,
//           style: {
//             fontSize: "var(--font-size-2)",
//             borderRadius: '0.3rem',
//             background: '#333',
//             color: '#fff',
//           },
//         })
//       } catch (error) {

//         if (error?.response?.status === 500) {
//           toast.error("Something went wrong !", {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: '0.3rem',
//               background: '#333',
//               color: '#fff',
//             },
//           });

//           return;
//         }

//         setUploadLoader(false)
//         // console.error('Image upload failed:', error);
//         toast.error(error?.response?.data?.message, {
//           duration: 3000,
//           style: {
//             fontSize: "var(--font-size-2)",
//             borderRadius: '0.3rem',
//             background: '#333',
//             color: '#fff',
//           },
//         });
//         setUploadAdvImages([])
//       }
//     }
//   }

//   const [publicId, setPublicId] = useState("")
//   const [mongoid, setMongoid] = useState("")

//   const [handleEditLoader, sethandleEditLoader] = useState(null)

//   // const editImageHandler = (publicId, mongoid, fileEditInputRef) => {
//   //   if (fileEditInputRef.current) {
//   //     fileEditInputRef.current.click();
//   //   } else {
//   //     console.error("File input ref is null");
//   //   }

//   //   setPublicId(publicId)
//   //   setMongoid(mongoid)
//   // }

//   const editImageHandler = (adv) => {
//     setEditAdvData(adv);
//     setPublicId(adv.public_id);
//     setMongoid(adv._id);
//     setSalonEditModal(true);
//   };

//   // const [salonEditLoader, setSalonEditLoader] = useState(null)

//   const [deleteLoader, setDeleteLoader] = useState(false)

//   const deleteHandler = async (publicId, mongoid) => {
//     const confirm = window.confirm("Are you sure ?")

//     if (confirm) {
//       try {
//         setDeleteLoader(true)
//         await api.delete("/api/advertisement/deleteAdvertisements", {
//           data: {
//             public_id: publicId,
//             img_id: mongoid
//           }
//         })
//         setDeleteLoader(false)
//         dispatch({
//           type: "FILTER_ADVERTISEMENTLIST",
//           payload: mongoid
//         })

//       } catch (error) {

//         if (error?.response?.status === 500) {
//           toast.error("Something went wrong !", {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: '0.3rem',
//               background: '#333',
//               color: '#fff',
//             },
//           });

//           return;
//         }

//         setDeleteLoader(false)

//         toast.error(error?.response?.data?.message, {
//           duration: 3000,
//           style: {
//             fontSize: "var(--font-size-2)",
//             borderRadius: '0.3rem',
//             background: '#333',
//             color: '#fff',
//           },
//         });

//         // console.log(error)
//       }
//     }

//   }

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (!over || active.id === over.id) {
//       return;
//     }

//     dispatch({
//       type: "DRAG_END_ADVERTISEMENTLIST",
//       payload: {
//         active,
//         over
//       }
//     })
//   };

//   const adminDragAdvertisementControllerRef = useRef(new AbortController());

//   useEffect(() => {
//     if (salonId && advertisements && advertisements?.length > 0) {
//       const controller = new AbortController();
//       adminDragAdvertisementControllerRef.current = controller;

//       dispatch(adminDragAdvertisementAction(salonId, advertisements, controller.signal));

//       return () => {
//         if (adminDragAdvertisementControllerRef.current) {
//           adminDragAdvertisementControllerRef.current.abort();
//         }
//       };
//     }
//   }, [advertisements, salonId, dispatch]);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(TouchSensor), // For Mobile
//     useSensor(KeyboardSensor, { // First go to the element press enter and then ctrl hold + up/down arrow
//       coordinateGetter: sortableKeyboardCoordinates
//     })
//   );

//   const [salonAdvModal, setSalonAdvModal] = useState(false);

//   const [salonEditModal, setSalonEditModal] = useState(false);
//   const [editAdvData, setEditAdvData] = useState(null);

//   const [selectedImageLastModified, setSelectedImageLastModified] = useState("");

//   const fileInputRef = useRef(null);
//   const [selectedImage, setSelectedImage] = useState(null);

//   console.log("Edit Advertisement Data: ", editAdvData);

//   const handleEditFileInputChange = async (e) => {
//     const uploadImage = editAdvData.file;

//     const allowedTypes = ["image/jpeg", "image/webp", "image/png"];

//     if (uploadImage) {
//       if (!allowedTypes.includes(uploadImage.type)) {
//         alert("Please upload a valid image file (JPEG, WebP, PNG).");
//         return;
//       }

//       const maxSizeInBytes = 2 * 1024 * 1024;
//       if (uploadImage.size > maxSizeInBytes) {
//         toast.error("File size must be lower than 2mb", {
//           duration: 3000,
//           style: {
//             fontSize: "var(--font-size-2)",
//             borderRadius: '0.3rem',
//             background: '#333',
//             color: '#fff',
//           },
//         });
//         return;
//       }
//     }

//     const formData = new FormData();

//     formData.append('id', mongoid)
//     formData.append('salonId', salonId);
//     formData.append('advertisementLink', editAdvData?.link || "")

//     if (uploadImage) {
//       formData.append('advertisements', uploadImage)
//       formData.append('public_imgid', publicId)
//     }

//     try {
//       sethandleEditLoader(mongoid)
//       const imageResponse = await api.put('/api/advertisement/updateAdvertisements', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // console.log('update success:', imageResponse.data);
//       setPublicId("")
//       setMongoid("")
//       setEditAdvData(null);
//       setSelectedImage("")
//       sethandleEditLoader(null)

//       dispatch({
//         type: "AFTER_UPDATE_ADVERTISEMENTLIST",
//         payload: imageResponse?.data?.response
//       })
//       setSalonEditModal(false)

//     } catch (error) {
//       setSalonEditModal(false)
//       setSelectedImage("")
//       if (error?.response?.status === 500) {
//         toast.error("Something went wrong !", {
//           duration: 3000,
//           style: {
//             fontSize: "var(--font-size-2)",
//             borderRadius: '0.3rem',
//             background: '#333',
//             color: '#fff',
//           },
//         });

//         return;
//       }

//       // console.error('Image upload failed:', error);
//       sethandleEditLoader(null)

//       toast.error(error?.response?.data?.message, {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//     }
//   };

//   return (
//     <section className={`${style.section}`}>
//       <div>
//         <h2>Advertisements <span>(Drag & Drop)</span></h2>
//         {/* <button onClick={() => navigate("/admin-salon/createsalon")}>Create</button> */}

//         {
//           adminProfile?.salonId !== 0 && (<div>
//             <div>
//               <button
//                 onClick={() => handleAdvImageButtonClick()}
//               >
//                 <FaFileIcon />
//                 Choose Files

//                 <input
//                   type="file"
//                   ref={advImagefileInputRef}
//                   style={{ display: 'none' }}
//                   multiple
//                   onChange={handleAdvImageFileInputChange}
//                   disabled={uploadLoader ? true : false}
//                 />
//               </button>
//               <p>
//                 {uploadAdvImages?.length}{" "}
//                 Files</p>
//             </div>
//             {/* {
//               uploadLoader ? <button><ButtonLoader color="#fff" /></button> :
//                 <button onClick={uploadAdvHandler} disabled={uploadLoader}>
//                   Upload
//                   <Uploadicon />
//                 </button>
//             } */}
//           </div>)
//         }
//       </div>

//       <div className={`${style.list_container}`}>
//         <div>
//           <Carousel
//             showThumbs={false}
//             infiniteLoop={true}
//             autoPlay={true}
//             interval={5000}
//             showStatus={false}
//             showArrows={false}
//             stopOnHover={true}
//             renderIndicator={false}
//           >
//             {
//               getAllAdvertisementLoading ? (
//                 <Skeleton
//                   count={1}
//                   width={"100%"}
//                   height={"30vh"}
//                   style={{ borderRadius: "0.6rem" }}
//                   baseColor={"var(--loader-bg-color)"}
//                   highlightColor={"var(--loader-highlight-color)"}
//                 />
//               ) : advertisements?.map((adv) => {
//                 return (<div className={`${style.carousel_item}`} key={adv._id}>
//                   <img src={adv.url} />
//                 </div>)
//               })
//             }

//           </Carousel>
//         </div>
//         <div>
//           {
//             getAllAdvertisementLoading ?
//               <>
//                 {[...Array(6)].map((_, index) => (
//                   <Skeleton
//                     key={index}
//                     count={1}
//                     width={"100%"}
//                     height={"30rem"}
//                     style={{ borderRadius: "0.6rem" }}
//                     baseColor={"var(--loader-bg-color)"}
//                     highlightColor={"var(--loader-highlight-color)"}
//                   />
//                 ))}
//               </> :
//               getAllAdvertisementResolve && advertisements?.length > 0 ?

//                 <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
//                   <SortableContext items={advertisements.map(adv => adv._id)} strategy={horizontalListSortingStrategy}>
//                     {advertisements.map((adv) => (
//                       <React.Fragment key={adv._id}>
//                         {/* <Adv id={adv._id} url={adv.url} public_id={adv.public_id} editImageHandler={editImageHandler} handleEditLoader={handleEditLoader} deleteHandler={deleteHandler} deleteLoader={deleteLoader} handleEditFileInputChange={handleEditFileInputChange} darkmodeOn={darkmodeOn} /> */}

//                         <Adv
//                           adv={adv}   // 👈 Pass full advertisement object
//                           id={adv._id}
//                           editImageHandler={editImageHandler}
//                           handleEditLoader={handleEditLoader}
//                           deleteHandler={deleteHandler}
//                           deleteLoader={deleteLoader}
//                           handleEditFileInputChange={handleEditFileInputChange}
//                           darkmodeOn={darkmodeOn}
//                         />

//                       </React.Fragment>
//                     ))}

//                   </SortableContext>

//                 </DndContext> :
//                 <div className={`${style.salonadv_column_error} ${darkmodeOn && style.dark}`}><p>No Advertisment Avaialble</p></div>
//           }

//         </div>
//       </div>

//       <Modal
//         open={salonAdvModal}
//         onClose={() => {
//           setSelectedImageLastModified("")
//           setUploadAdvImages([]);
//           setSalonAdvModal(false)
//         }}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >

//         <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
//           <div>
//             <p>Upload Advertisement</p>
//             <button
//               onClick={() => {
//                 setSelectedImageLastModified("")
//                 setUploadAdvImages([]);
//                 setSalonAdvModal(false)
//               }}
//             ><CloseIcon /></button>
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>

//             {
//               uploadAdvImages.map((item, index) => {
//                 return (
//                   <div
//                     key={item?.lastModified}
//                     className={style.uploadImage_item}>
//                     <div>
//                       <div><FileImage color='#0284c7' /></div>
//                       <p className={style.truncateText}>{item?.name}</p>
//                     </div>

//                     <p>{`${(item?.size / 1024).toFixed(2)} KB`}</p>

//                     <div>
//                       <p>File URL :</p>
//                       <input
//                         value={item?.link}
//                         onChange={(e) => fileLinkChangeHandler(e, item)}
//                         placeholder="https://example.com"
//                       />
//                     </div>

//                   </div>
//                 )
//               })
//             }

//             {
//               uploadAdvImages.map((item, index) => {
//                 return (
//                   <div
//                     key={item?.lastModified}
//                     className={style.uploadImage_mobile_item}>
//                     <div>
//                       <div>
//                         <div><FileImage color='#0284c7' /></div>
//                         <p className={style.truncateText}>{item?.name}</p>
//                       </div>

//                       <p>{`${(item?.size / 1024).toFixed(2)} KB`}</p>
//                     </div>

//                     <div>
//                       <p>File URL :</p>
//                       <input
//                         value={item?.link}
//                         onChange={(e) => fileLinkChangeHandler(e, item)}
//                         placeholder="https://example.com"
//                       />
//                     </div>

//                   </div>
//                 )
//               })
//             }

//           </div>

//           {
//             uploadLoader ? <button className={style.advUploadBtn}><ButtonLoader /></button> : <button
//               disabled={uploadLoader}
//               className={style.advUploadBtn} onClick={async () => {
//                 await uploadAdvHandler()
//                 setSalonAdvModal(false)
//               }}>Upload</button>

//           }

//         </div>

//       </Modal>

//       <Modal
//         open={salonEditModal}
//         onClose={() => {
//           setEditAdvData(null);
//           setSalonEditModal(false);
//         }}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
//           <div>
//             <p>Edit Advertisement</p>
//             <button
//               onClick={() => {
//                 setEditAdvData(null);
//                 setSalonEditModal(false);
//               }}
//             >
//               <CloseIcon />
//             </button>
//           </div>

//           {editAdvData && (
//             <div className={style.editImage_item}>
//               <div>
//                 <img
//                   src={selectedImage ? selectedImage : editAdvData.url}
//                   alt="Advertisement Preview"
//                 />

//                 <div>
//                   <button
//                     onClick={() => fileInputRef.current.click()}
//                     className={style.chooseImageBtn}
//                   >
//                     Choose New Image
//                   </button>

//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/jpeg,image/png,image/webp"
//                     style={{ display: "none" }}
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setSelectedImage(URL.createObjectURL(file)); // 👈 Preview image
//                         setEditAdvData((prev) => ({ ...prev, file })); // 👈 Save file for upload
//                       }
//                     }}
//                   />
//                 </div>

//               </div>

//               <div>
//                 <p>Advertisement Link:</p>
//                 <input
//                   type="text"
//                   value={editAdvData.link || ""}
//                   onChange={(e) =>
//                     setEditAdvData((prev) => ({ ...prev, link: e.target.value }))
//                   }
//                   placeholder="https://example.com"
//                 />
//               </div>

//               {/* Choose New Image Button */}
//               {/* <div style={{ marginTop: "1rem" }}>
//                 <button
//                   onClick={() => fileInputRef.current.click()}
//                   className={style.chooseImageBtn}
//                 >
//                   Choose New Image
//                 </button>

//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept="image/jpeg,image/png,image/webp"
//                   style={{ display: "none" }}
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       setSelectedImage(URL.createObjectURL(file)); // 👈 Preview image
//                       setEditAdvData((prev) => ({ ...prev, file })); // 👈 Save file for upload
//                     }
//                   }}
//                 />
//               </div> */}

//             </div>

//           )}

//           {
//             handleEditLoader === editAdvData?._id
//               ? <button className={style.advUploadBtn}><ButtonLoader /></button>
//               : <button
//                 className={style.advUploadBtn}
//                 disabled={handleEditLoader === editAdvData?._id}
//                 onClick={() => {
//                   handleEditFileInputChange()

//                 }}
//               >
//                 Save Changes
//               </button>
//           }
//         </div>
//       </Modal>

//     </section >
//   )
// }

// export default SalonAdv

// // const Adv = ({ id, url, public_id, editImageHandler, handleEditLoader, deleteHandler, deleteLoader, handleEditFileInputChange, darkmodeOn }) => {
// //   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

// //   // const style = {
// //   //   transition,
// //   //   transform: CSS.Transform.toString(transform)
// //   // };

// //   const fileEditInputRef = useRef(null);

// //   return (
// //     <div className={`${style.salonadv_task} ${darkmodeOn && style.dark}`} ref={setNodeRef} {...attributes} {...listeners} style={{
// //       transition,
// //       transform: CSS.Transform.toString(transform)
// //     }}>

// //       {
// //         handleEditLoader === id ?
// //           <div><Skeleton width={"100%"} height={"100%"} /></div> :
// //           <div><img src={url} alt="" /></div>
// //       }
// //       <div>
// //         <button
// //           onClick={() => editImageHandler(public_id, id, fileEditInputRef)}
// //           disabled={handleEditLoader === id}
// //           onPointerDown={(e) => e.stopPropagation()}
// //           onTouchStart={(e) => e.stopPropagation()}
// //         >
// //           <div><EditIcon /></div>
// //           <p>Edit</p>
// //           <input
// //             type="file"
// //             ref={fileEditInputRef}
// //             style={{ display: 'none' }}
// //             onChange={handleEditFileInputChange}
// //           />
// //         </button>
// //         <button
// //           onClick={() => deleteHandler(public_id, id)}
// //           disabled={deleteLoader}
// //           onPointerDown={(e) => e.stopPropagation()}
// //           onTouchStart={(e) => e.stopPropagation()}
// //         >
// //           <div><DeleteIcon /></div>
// //           <p>Delete</p>
// //         </button>
// //       </div>
// //     </div>
// //   );

// // };

// const Adv = ({ adv, id, editImageHandler, handleEditLoader, deleteHandler, deleteLoader, handleEditFileInputChange, darkmodeOn }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   return (
//     <div className={`${style.salonadv_task} ${darkmodeOn && style.dark}`}
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={{ transition, transform: CSS.Transform.toString(transform) }}
//     >
//       {
//         handleEditLoader === id
//           ? <div><Skeleton width={"100%"} height={"100%"} /></div>
//           : <div><img src={adv.url} alt="" /></div>
//       }

//       <div>
//         <button
//           onClick={() => editImageHandler(adv)} // 👈 Pass full adv
//           disabled={handleEditLoader === id}
//           onPointerDown={(e) => e.stopPropagation()}
//           onTouchStart={(e) => e.stopPropagation()}
//         >
//           <div><EditIcon /></div>
//           <p>Edit</p>
//         </button>
//         <button
//           onClick={() => deleteHandler(adv.public_id, adv._id)}
//           disabled={deleteLoader}
//           onPointerDown={(e) => e.stopPropagation()}
//           onTouchStart={(e) => e.stopPropagation()}
//         >
//           <div><DeleteIcon /></div>
//           <p>Delete</p>
//         </button>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import style from "./SalonAdv.module.css";
import { CloseIcon, FaFileIcon } from "../../icons";
import { Modal } from "@mui/material";

const SalonAdv = () => {
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUploadImage, setSelectedUploadImage] = useState("");
  const [selectedEditImage, setSelectedEditImage] = useState("");

  const [openMobileUpload, setOpenMobileUpload] = useState(false);
  const [openMobileEdit, setOpenMobileEdit] = useState(false);

  return (
    <section className={`${style.adv_section}`}>
      <div className={style.adv_section_left}>
        {openUpload ? (
          <div className={style.upload_container}>
            <div>
              <div>
                <div>
                  <FaFileIcon color={"var(--text-primary)"} />
                </div>
                <div>
                  <p>Upload file</p>
                  <p>Select and upload file of your choice</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpenUpload(false);
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={style.adv_image_box}>
              {selectedUploadImage ? (
                <div className={style.adv_image_present}>
                  <img src={selectedUploadImage} alt="" />
                  <button
                    onClick={() => {
                      setSelectedUploadImage("");
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className={style.adv_image_notpresent}>
                  <div>
                    <FaFileIcon color={"var(--text-primary)"} />
                  </div>
                  <p>Choose a file or drag & drop it here</p>
                  <p>jpeg, png, webp formats, up to 2mb.</p>
                  <button
                    onClick={() => {
                      setOpenUpload(true);
                      setSelectedUploadImage(
                        "https://img.freepik.com/free-vector/flat-design-beauty-salon-facebook-cover_23-2150819476.jpg?semt=ais_hybrid&w=740&q=80"
                      );
                    }}
                  >
                    Browse file
                  </button>
                </div>
              )}

              <div>
                <div>
                  <FaFileIcon />
                </div>
                <div>
                  <p>Target url</p>
                  <p>120 KB</p>
                </div>
                <input placeholder="https://example.com" type="text" />
              </div>

              <button className={style.upload_button}>upload</button>
            </div>
          </div>
        ) : openEdit ? (
          <div className={style.upload_container}>
            <div>
              <div>
                <div>
                  <FaFileIcon color={"var(--text-primary)"} />
                </div>
                <div>
                  <p>Upload file</p>
                  <p>Select and upload file of your choice</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpenEdit(false);
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={style.adv_image_box}>
              {selectedEditImage ? (
                <div className={style.adv_image_present}>
                  <img src={selectedEditImage} alt="" />
                  <button
                    onClick={() => {
                      setSelectedEditImage("");
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className={style.adv_image_notpresent}>
                  <div>
                    <FaFileIcon color={"var(--text-primary)"} />
                  </div>
                  <p>Choose a file or drag & drop it here</p>
                  <p>jpeg, png, webp formats, up to 2mb.</p>
                  <button
                    onClick={() => {
                      setSelectedEditImage(
                        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=2800,h=1680,fit=crop/Yg2y44MM36I5P7eD/whatsapp-image-2025-07-13-at-15.44.55_a3d65a80-AoPJ44L0Q8u3Zolg.jpg"
                      );
                    }}
                  >
                    Browse file
                  </button>
                </div>
              )}

              <div>
                <div>
                  <FaFileIcon />
                </div>
                <div>
                  <p>Target url</p>
                  <p>120 KB</p>
                </div>
                <input placeholder="https://example.com" type="text" />
              </div>

              <div className={style.edit_button_container}>
                <button>Delete</button>
                <button>Update</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={style.upload_container}>
            <div>
              <div>
                <div>
                  <FaFileIcon color={"var(--text-primary)"} />
                </div>
                <div>
                  <p>Upload file</p>
                  <p>Select and upload file of your choice</p>
                </div>
              </div>
            </div>

            <div className={style.adv_empty_box}>
              <div>
                <FaFileIcon color={"var(--text-primary)"} />
              </div>
              <p>Choose a file or drag & drop it here</p>
              <p>jpeg, png, webp formats, up to 2mb.</p>
              <button
                onClick={() => {
                  setOpenUpload(true);
                  setSelectedUploadImage(
                    "https://img.freepik.com/free-vector/flat-design-beauty-salon-facebook-cover_23-2150819476.jpg?semt=ais_hybrid&w=740&q=80"
                  );
                }}
              >
                Browse file
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={style.adv_section_right}>
        <div>
          <div>
            <img
              src="https://img.freepik.com/free-vector/flat-design-beauty-salon-facebook-cover_23-2150819476.jpg?semt=ais_hybrid&w=740&q=80"
              alt=""
            />
          </div>

          <div>
            <div>
              <p>Advertisements</p>
              <p>Tap to edit advertisements</p>
            </div>
            <p>Image: 3</p>
          </div>

          <button
            onClick={() => {
              setOpenMobileUpload(true);
            }}
            className={style.adv_mobile_plus_container}
          >
            <p>+</p>
          </button>

          <div className={style.adv_image_scrolling_section}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
              return (
                <div
                  onClick={() => {
                    setOpenUpload(false);
                    setSelectedUploadImage("");
                    setOpenEdit(true);
                    setOpenMobileEdit(true);
                    setSelectedEditImage(
                      "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=2800,h=1680,fit=crop/Yg2y44MM36I5P7eD/whatsapp-image-2025-07-13-at-15.44.55_a3d65a80-AoPJ44L0Q8u3Zolg.jpg"
                    );
                  }}
                  className={style.adv_item}
                  key={item}
                >
                  <img
                    src="https://img.freepik.com/free-vector/flat-design-beauty-salon-facebook-cover_23-2150819476.jpg?semt=ais_hybrid&w=740&q=80"
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        open={openMobileUpload}
        onClose={() => setOpenMobileUpload(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={style.modal_common_container}>
          <div className={style.upload_container}>
            <div>
              <div>
                <div>
                  <FaFileIcon color={"var(--text-primary)"} />
                </div>
                <div>
                  <p>Upload file</p>
                  <p>Select and upload file of your choice</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpenUpload(false);
                  setOpenMobileUpload(false);
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={style.adv_image_box}>
              {selectedUploadImage ? (
                <div className={style.adv_image_present}>
                  <img src={selectedUploadImage} alt="" />
                  <button
                    onClick={() => {
                      setSelectedUploadImage("");
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className={style.adv_image_notpresent}>
                  <div>
                    <FaFileIcon color={"var(--text-primary)"} />
                  </div>
                  <p>Choose a file or drag & drop it here</p>
                  <p>jpeg, png, webp formats, up to 2mb.</p>
                  <button
                    onClick={() => {
                      setOpenUpload(true);
                      setSelectedUploadImage(
                        "https://img.freepik.com/free-vector/flat-design-beauty-salon-facebook-cover_23-2150819476.jpg?semt=ais_hybrid&w=740&q=80"
                      );
                    }}
                  >
                    Browse file
                  </button>
                </div>
              )}

              <div>
                <div>
                  <FaFileIcon />
                </div>
                <div>
                  <p>Target url</p>
                  <p>120 KB</p>
                </div>
                <input placeholder="https://example.com" type="text" />
              </div>

              <button className={style.upload_button}>upload</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={openMobileEdit}
        onClose={() => setOpenMobileEdit(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={style.modal_common_container}>
          <div className={style.upload_container}>
            <div>
              <div>
                <div>
                  <FaFileIcon color={"var(--text-primary)"} />
                </div>
                <div>
                  <p>Upload file</p>
                  <p>Select and upload file of your choice</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpenMobileEdit(false);
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={style.adv_image_box}>
              {selectedEditImage ? (
                <div className={style.adv_image_present}>
                  <img src={selectedEditImage} alt="" />
                  <button
                    onClick={() => {
                      setSelectedEditImage("");
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className={style.adv_image_notpresent}>
                  <div>
                    <FaFileIcon color={"var(--text-primary)"} />
                  </div>
                  <p>Choose a file or drag & drop it here</p>
                  <p>jpeg, png, webp formats, up to 2mb.</p>
                  <button
                    onClick={() => {
                      setSelectedEditImage(
                        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=2800,h=1680,fit=crop/Yg2y44MM36I5P7eD/whatsapp-image-2025-07-13-at-15.44.55_a3d65a80-AoPJ44L0Q8u3Zolg.jpg"
                      );
                    }}
                  >
                    Browse file
                  </button>
                </div>
              )}

              <div>
                <div>
                  <FaFileIcon />
                </div>
                <div>
                  <p>Target url</p>
                  <p>120 KB</p>
                </div>
                <input placeholder="https://example.com" type="text" />
              </div>

              <div className={style.edit_button_container}>
                <button>Delete</button>
                <button>Update</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default SalonAdv;
