import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import { RxCaretDown, RxCaretUp, RxCross1 } from "react-icons/rx";
import { IoMdLogOut } from "react-icons/io";
import { TbCameraPlus } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server/server";
import { toast } from "react-toastify";
import { FiMoreVertical } from "react-icons/fi";
import { getAllUsers, userLoader } from "../../Redux/Action/userAction";
import { getAllPost } from "../../Redux/Action/postAction";
import Loader from "../../Lodar/Loader";
import { Vortex } from "react-loader-spinner";

const ProfilePage = () => {
  const { user, isLoding, alluser } = useSelector((state) => state.user);


  const { post } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams(); 
  const anotherUserId = searchParams.get("id");


  const [postListData, setPostListData] = useState([]);
  const [openBurger, setOpenBurgur] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [anotherUserData, setAnotherUserData] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    if (anotherUserId !== null) {

      if (!alluser || alluser.length === 0) {
        dispatch(getAllUsers()); // Dispatch an action to fetch all users
      } else {
        const filterData = alluser?.find((item) => item._id === anotherUserId);

        setAnotherUserData(filterData);
      }
    }
  }, [anotherUserId, alluser, dispatch]);

  useEffect(() => {
    const id = anotherUserData ? anotherUserData._id : user._id;

    const totalPost = post?.filter((item) => item?.user_id === id);


    if (totalPost?.length > 0) {
      setPostListData(totalPost);
    }
  }, [post, anotherUserData]);

  const handleLogout = async () => {
    await axios
      .post(
        `${server}/user/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          dispatch(userLoader());
          // window.location.reload();
          navigate("/login");
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeletePost = async (id) => {
    await axios
      .delete(`${server}/posts/delete-post/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          dispatch(getAllPost());
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
    setDeletePostId(null);
  };



  return (
    <>
      {isLoding ? (
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
        <div className=" mx-auto p-2 sm:ml-44">
          <div className="flex flex-col items-center">
            <div className="flex flex-col  md:flex-row md:justify-between md:w-full">
              <div className="sm:hidden flex justify-between text-xl mb-2">
                <div className="flex space-x-2 cursor-pointer">
                  <div className="font-semibold">
                    {anotherUserData
                      ? anotherUserData?.username
                      : user?.username}
                  </div>
                  <RxCaretDown
                    className={`${anotherUserData && "hidden"} text-3xl`}
                  />
                </div>
                <div
                  className={`${
                    anotherUserData && "hidden"
                  } relative w-[100px]`}
                >
                  <div className="flex justify-end">
                    <RxHamburgerMenu
                      className="text-xl font-bold cursor-pointer"
                      onClick={() => setOpenBurgur(!openBurger)}
                    />
                  </div>
                  {openBurger && (
                    <div className="absolute bg-gray-100 w-[100px] right-0 py-2 pl-2 shadow-2xl select-none">
                      <div
                        onClick={() => setOpenLogout(!openLogout)}
                        className="cursor-pointer"
                      >
                        <h1 className="flex  items-center text-sm hover:text-red-400">
                          <span className="mr-2 ">
                            <IoMdLogOut />
                          </span>
                          Logout
                        </h1>
                      </div>
                      {openLogout && (
                        <div className="fixed bg-[#0000004b] inset-0 w-full h-screen z-20">
                          <div className="flex justify-center items-center w-full h-full ">
                            <div className="bg-white p-4 rounded-md">
                              <div className="w-full flex justify-end mb-3 cursor-pointer">
                                <RxCross1
                                  size={30}
                                  onClick={() => setOpenLogout(!openLogout)}
                                />
                              </div>
                              <div>
                                Logout{" "}
                                <span
                                  className="bg-blue-500 ml-4 px-3 py-1 rounded-xl cursor-pointer hover:bg-blue-400"
                                  onClick={handleLogout}
                                >
                                  Conform
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="pl-0 flex justify-center items-center">
                <div className="relative">
                  <img
                    className="w-[4.2rem] h-[4.2rem] rounded-full object-cover md:w-40 md:h-40 bg-gray-400 border border-blue-500 border-spacing-3 transition-transform transform hover:scale-110 shadow-lg cursor-pointer "
                    src={
                      anotherUserData
                        ? anotherUserData?.profile_pic?.url
                        : user?.profile_pic?.url
                    }
                    alt="Profile"
                    onClick={() => setOpenProfile(!openProfile)}
                  />
                  {openProfile && (
                    <div className="fixed bg-black bg-opacity-75 inset-0 w-full h-screen flex justify-center items-center z-50">
                      <div className="bg-white p-4 rounded-lg shadow-lg">
                        <img
                          className="w-[10rem] h-[10rem] rounded-full object-container md:w-40 md:h-40 bg-gray-400 border border-blue-500 border-spacing-3 transition-transform transform hover:scale-110 "
                          src={
                            anotherUserData
                              ? anotherUserData?.profile_pic?.url
                              : user?.profile_pic?.url
                          }
                          alt="Profile"
                          onClick={() => setOpenProfile(!openProfile)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-3 select-none">
                  <div className="hidden sm:flex space-x-3 pl-10 md:w-full">
                    <p className="font-semibold ">
                      {anotherUserData
                        ? anotherUserData?.username
                        : user?.username}
                    </p>
                    {!anotherUserData && (
                      <>
                        <button
                          className="bg-slate-400 rounded-sm px-2 hover:bg-slate-500 "
                          //   onClick={handleEditeProfile}
                        >
                          <Link to="/profile/edit">Edit Profile</Link>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-4 mt-1 pl-10 text-center font-semibold text-[1rem] px-2">
                    <div className="font-semibold">
                      <span className="font-bold">{postListData?.length}</span>{" "}
                      Posts
                    </div>
                    {anotherUserId ? (
                      <Link
                        to={`/follow_unfollow?active=1&id=${anotherUserId}`}
                      >
                        <span className="font-bold">
                          {anotherUserData
                            ? anotherUserData.followers.length
                            : user?.followers?.length}
                        </span>{" "}
                        Followers
                      </Link>
                    ) : (
                      <Link to={`/follow_unfollow?activepage=1`}>
                        <span className="font-bold">
                          {user?.followers?.length}
                        </span>{" "}
                        Followers
                      </Link>
                    )}
                    {anotherUserId ? (
                      <Link
                        to={`/follow_unfollow?active=2&id=${anotherUserId}`}
                      >
                        <span className="font-bold">
                          {anotherUserData
                            ? anotherUserData.following.length
                            : user?.following?.length}
                        </span>{" "}
                        Following
                      </Link>
                    ) : (
                      <Link to="/follow_unfollow?activepage=2">
                        <span className="font-bold">
                          {user?.following?.length}
                        </span>{" "}
                        Following
                      </Link>
                    )}
                  </div>
                  <div className="pl-10 hidden sm:block">
                    <p className="font-semibold ">
                      {anotherUserData
                        ? anotherUserData?.fullname
                        : user?.fullname}
                    </p>
                    <p className="mt-1 ">
                      {anotherUserData ? anotherUserData?.bio : user?.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* mobile */}
              <div className="mt-2 text-start sm:hidden">
                <p className="font-bold text-xl">
                  {anotherUserData ? anotherUserData?.fullname : user?.fullname}
                </p>
                <p className="mt-1 font-semibold">
                  {anotherUserData ? anotherUserData?.bio : user?.bio}
                </p>
              </div>
              <div
                className={`${
                  anotherUserData && "hidden"
                } flex justify-around w-full sm:hidden`}
              >
                <button className="w-[8rem] bg-slate-200 rounded-sm px-2 hover:bg-slate-500 ">
                  <Link to="/profile/edit">Edit Profile</Link>
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <hr className="border-2 border-gray-400 my-4 w-full" />
              <h1 className="text-xl font-sans font-bold text-center">
                Total Post
              </h1>
              <div className="grid grid-cols-3 gap-4 mt-8 md:w-2/3 h-full">
                {postListData.map((post, ind) => (
                  <div key={ind} className=" flex justify-center items-center">
                    <div className="w-full h-full relative">
                      <img
                        src={post?.file?.url}
                        alt={`Post ${post._id}`}
                        className="w-full h-full object-container cursor-pointer z-10"
                      />
                      <FiMoreVertical
                        className={`${
                          anotherUserData && "hidden"
                        } font-bold text-2xl cursor-pointer absolute top-2 right-1 text-red-400 hover:text-red-800 z-10`}
                        onClick={() => setDeletePostId(post._id)}
                      />
                    </div>
                    {deletePostId === post._id && (
                      <div className="fixed bg-[#0000004b] inset-0 w-full h-screen z-40">
                        <div className="flex justify-center items-center w-full h-full ">
                          <div className="bg-white p-4 rounded-md ">
                            <div className="w-full flex justify-end mb-3 cursor-pointer">
                              <RxCross1
                                size={30}
                                onClick={() => setDeletePostId(null)}
                              />
                            </div>
                            <div>
                              Are You Sure?
                              <span
                                className="bg-blue-500 ml-4 px-3 py-1 rounded-xl cursor-pointer hover:bg-blue-400"
                                onClick={() => handleDeletePost(post?._id)}
                              >
                                Delete
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
