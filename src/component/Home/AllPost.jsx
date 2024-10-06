// import { jwtDecode } from "jwt-decode";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server/server";
import { fetchAllStatus } from "../../Redux/Action/statusAction";
import { Vortex } from 'react-loader-spinner';

import Comment from "../Comment/Comment.jsx";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { userLoader } from "../../Redux/Action/userAction.js";
import { RxCross1 } from "react-icons/rx";
import { FaArrowAltCircleDown } from "react-icons/fa";
import Loader from "../../Lodar/Loader.jsx";

const AllPost = () => {
  const { alluser, user } = useSelector((state) => state.user);
  const { statusList } = useSelector((state) => state.status);



  const [dataList, setDataList] = useState([]);
  const [commentsList, setCommentsList] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState("text");

  const [statusListData, setStatusListData] = useState([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [openStatusPic, setOpenStatusPic] = useState(false);
  const [activePostMenu, setActivePostMenu] = useState(null);
  const [deleteStatusId, setDeleteStatusId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id === null) dispatch(userLoader());
  }, [user?._id]);

  useEffect(() => {
    if (statusList.length === 0) {
      dispatch(fetchAllStatus());
    }
    const updatedData = statusList.map((item) => ({
      [user?._id]: item,
    }));
    setStatusListData(updatedData);
  }, [dispatch, statusList.length, statusListData.length, openStatus]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      // Add 'overflow-hidden' to the body element to stop scrolling
      document.body.classList.add("overflow-hidden");
    } else {
      // Remove 'overflow-hidden' from the body element to restore scrolling
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]); // Dependency array watches the isModalOpen state
  38;

  const fetchAllPostData = async () => {
    try {
      const response = await axios.get(`${server}/posts/getallpost`);

      // console.log(response.data.result);

      if (response.data.success) {
        setDataList(response?.data?.result);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchAllPostData();
  }, []);

  const fetchCommentsList = async (id) => {
    try {
      const response = await axios.get(
        `${server}/post/comments/list?post_id=${id}`,
        {
          headers: {
            "content-type": "application/json",
          },
          withCredentials: true,
        }
      );

     
      if (response.data.success) {
        setCommentsList((prev) => ({
          ...prev,
          [id]: response.data.totalMainComments,
        }));
        // for(let i = 0;i < result?.result?.length;i++){
        setUserDetails((prev) => ({
          ...prev,
          [id]: response.data.result,
        }));
        // }
      }
    } catch (err) {
     toast.error(err.message);
    }
  };

  useEffect(() => {
    if (dataList.length > 0) {
      dataList.forEach((data) => fetchCommentsList(data._id));
    }
  }, [dataList]);

  const handleLike = async (id) => {
    if (!user) {
      navigate("/login");
    }
    const postIndex = dataList.findIndex((item) => item?._id === id);
    if (postIndex === -1) return;

    const newDataList = [...dataList];
    const post = newDataList[postIndex];

    const hasLiked = post?.likes?.includes(user?._id);

    if (hasLiked) {
      post.likes = post.likes.filter((likeId) => likeId !== user?._id);
    } else {
      post.likes.push(user?._id);
    }

    setDataList(newDataList);

    try {
      const response = await axios.post(
        `${server}/posts/like`,
        { post_id: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setDataList(dataList);
      }
    } catch (error) {
      setDataList(dataList);
    }
  };

  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  // Handle file change
  const handleFileChange = (e) => {
    setStatus(e.target.files[0]);
    setMediaType(e.target.files[0].type.includes("image") ? "image" : "video");
  };

  const handleStatus = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("mediaType", mediaType);

    if (status) {
      formData.append("status", status);
    }

    await axios
      .post(`${server}/status/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {

        if (response.data.success) {
          setStatusListData((prev) => [
            {
              [user?._id]: response.data.status,
              ...prev,
            },
          ]);
          setOpenStatus(!openStatus);
          setContent("");
          dispatch(fetchAllStatus());
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDownload = async (PostId) => {

    await axios
      .get(`${server}/posts/download/${PostId}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Function to find the user for each post
  const findUserForPost = (userId) => {
    return alluser?.find((user) => user._id === userId);
  };

  const handleDeleteStatus = async (id) => {
    await axios
      .delete(`${server}/status/delete/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response?.data?.success) {
          dispatch(fetchAllStatus());
          toast.success(response?.data?.message);
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
      setDeleteStatusId(null);
      setOpenStatusPic(null);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        isModalOpen ? "overflow-hidden" : ""
      }`}
    >
      <div className="w-full bg-slate-200 py-2 sticky top-0 z-999999 sm:hidden">
      <div className="flex items-center">
          <img
            src="/Images/logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-3xl"
          />
          <span className="text-xl font-bold ml-2">Gramify</span>
        </div>
      </div>
      <div className=" w-full px-2  flex justify-start sm:sticky sm:top-0 sm:z-50 bg-white">
        {user && (
          <>
            <div
              onClick={() => setOpenStatus(!openStatus)}
              className="w-[70px] h-[70px]"
            >
              <div className="relative">
                <img
                  src={user?.profile_pic?.url}
                  alt="pic"
                  className="w-[70px] h-[70px] rounded-full"
                />
                <AiOutlinePlus
                  size={25}
                  className="absolute bottom-0 font-bold right-1 bg-white rounded-full"
                />
              </div>
            </div>

            <div className="ml-2 flex overflow-x-scroll max-w-full gap-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-0 sm:hide-scrollbar">
              {statusListData?.map((status, i) => {
                return (
                  <div className="min-w-[80px] flex-shrink-0 " key={i}>
                    <img
                      src={status[user?._id]?.content}
                      alt="pic"
                      className="w-[70px] h-[70px] rounded-full object-container"
                      onClick={() =>
                        setOpenStatusPic(status[user?._id]?.content)
                      }
                    />

                    {openStatusPic === status[user?._id]?.content && (
                      <div className="fixed bg-black bg-opacity-75 inset-0 w-full h-screen flex justify-center items-center z-10">
                        <div className="p-4 rounded-lg shadow-lg w-[500px] h-[500px] flex items-center justify-center ">
                          <div className="sm:h-[70vh] relative">
                            <img
                              className=" object-container"
                              src={status[user?._id]?.content}
                              alt="status"
                              width={250}
                              height={900}
                              onClick={() => setOpenStatusPic(null)}
                            />
                            <FiMoreVertical
                              className={`${
                                status[user?._id]?.user !== user._id && "hidden"
                              } font-bold text-2xl cursor-pointer absolute top-2 right-1 bg-white hover:bg-red-300 z-10`}
                              onClick={() =>
                                setDeleteStatusId(status[user?._id]?._id)
                              }
                            />
                            {deleteStatusId === status[user?._id]?._id && (
                              <div className="fixed bg-black bg-opacity-25 inset-0 w-full h-screen flex justify-center items-center z-50">
                                <div className="p-4 rounded-lg shadow-lg w-[90vw] max-w-[500px] h-[90vh] max-h-[500px] flex items-center justify-center">
                                  <div className="relative w-full h-full flex justify-center items-center">
                                    {deleteStatusId ===
                                      status[user?._id]?._id && (
                                      <div className="fixed bg-[#0000004b] inset-0 w-full h-screen z-[4000] flex justify-center items-center">
                                        <div className="bg-white p-6 rounded-md shadow-md w-[80vw] max-w-[400px]">
                                          <div className="w-full flex justify-end mb-4 cursor-pointer">
                                            <RxCross1
                                              size={30}
                                              onClick={() =>
                                                setDeleteStatusId(null)
                                              }
                                            />
                                          </div>
                                          <div className="text-center">
                                            <p className="mb-4">
                                              Are You Sure?
                                            </p>
                                            <span
                                              className="bg-blue-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-400"
                                              onClick={() =>
                                                handleDeleteStatus(
                                                  status[user?._id]?._id
                                                )
                                              }
                                            >
                                              Delete
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {openStatus && (
              <div className="fixed w-full inset-0 bg-[#0000004b] z-10">
                <div className="w-full h-full flex justify-center items-center z-100">
                  <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10 ">
                    <div className="w-full flex justify-end cursor-pointer">
                      <RxCross1
                        size={25}
                        className="flex justify-end fixed"
                        onClick={() => setOpenStatus(!openStatus)}
                      />
                    </div>
                    <h1 className="text-xl font-bold mb-4">Add Status</h1>
                    <form onSubmit={handleStatus} className="space-y-4">
                      <div>
                        <label htmlFor="file" className="block text-gray-700">
                          Upload Media (required)
                        </label>
                        <input
                          id="file"
                          type="file"
                          onChange={handleFileChange}
                          className="mt-1"
                          accept="image/*,video/*"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                      >
                        Submit Status
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <hr className="w-full bg-black " />

      <div className=" flex flex-col gap-4 sm:gap-8 px-2">
        {!dataList ? (
          <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
        ) : (
          dataList?.map((data) => {
            const postUser = findUserForPost(data.user_id);
            return (
              <div
                key={data._id}
                className="h-[86vh] sm:h-[88vh] sm:w-96 bg-cover py-1 select-none"
              >
                <div className="flex justify-between items-center  ">
                  <div className="flex justify-center items-center ">
                    <div className="rounded-full ">
                      <Link
                        to={
                          data.user_id !== user?._id
                            ? `/profile?id=${data?.user_id}`
                            : `/profile`
                        }
                      >
                        <img
                          src={postUser?.profile_pic?.url}
                          className="h-9 w-9 rounded-3xl"
                          alt="logo"
                        />
                      </Link>
                    </div>
                    <Link
                      to={
                        data?.user_id !== user?._id
                          ? `/profile?id=${data?.user_id}`
                          : `/profile`
                      }
                    >
                      <div className="text-xl font-sans font-semibold mx-4">
                        {postUser?.fullname}
                      </div>
                    </Link>
                  </div>
                  <div className="relative px-3">
                    <FiMoreHorizontal
                      className="font-bold text-2xl cursor-pointer"
                      onClick={() =>
                        setActivePostMenu((prev) =>
                          prev === data?._id ? null : data._id
                        )
                      }
                    />
                    {activePostMenu === data?._id && (
                      <div
                        className="absolute bg-slate-100 top-0 right-10 flex justify-center items-center px-2 "
                        onClick={() => handleDownload(data?._id)}
                      >
                        <div className="px-4 py-2">Download</div>
                        <FaArrowAltCircleDown size={20} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center py-6">
                  <div className="relative">
                    <img
                      src={data?.file?.url}
                      alt={`Post `}
                      className="md:w-[80vh] w-[75vh] md:h-[80vh] h-[75vh] object-container "
                    />
                    <div className="flex justify-start w-full p-2 font-bold absolute bottom-0 text-xl bg-slate-300">
                      {data?.caption}
                    </div>

                    <div className="absolute bottom-40 right-2 text-white space-y-2">
                      <div className="flex items-center space-x-1">
                        <FaHeart
                          className={`${
                            data?.likes?.includes(user?._id) && "text-red-500"
                          } text-3xl`}
                          onClick={() => handleLike(data?._id)}
                        />
                        <span className="select-none">
                          {data?.likes?.length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaComment
                          className="text-3xl cursor-pointer"
                          onClick={() => handleCommentClick(data?._id)}
                        />
                        <span className="select-none">
                          {commentsList[data?._id] || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Comment
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  postId={selectedPostId}
                  userDetails={userDetails}
                  fetchCommentsList={fetchCommentsList}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllPost;
