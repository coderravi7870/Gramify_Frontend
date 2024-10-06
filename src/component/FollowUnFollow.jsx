import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { server } from "../server/server";
import axios from "axios";
import { toast } from "react-toastify";
import { userLoader } from "../Redux/Action/userAction";

const FollowUnFollow = () => {
  const [searchParams] = useSearchParams();
  const activeValue = searchParams.get("active");
  const anotherUserId = searchParams.get("id");
  const active = Number(activeValue);

  if (anotherUserId === null) {
    const activeValue = searchParams.get("activepage");

    const localactive = Number(activeValue);

    const { user } = useSelector((state) => state.user);

    const [followingsId, setFollowingsId] = useState(user?.following || null);
    const [followersData, setFollowersData] = useState([]);
    const [followingssData, setFollowingsData] = useState([]);

    // console.log(followingssData);

    // const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollowToggle = async (id) => {
      try {
        const response = await axios.post(
          `${server}/user/unfollow`,
          {
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        // console.log(response.data);
        if (response.data.success) {
          setFollowingsId(
            followingsId.filter((followingId) => followingId !== id)
          );
          dispatch(userLoader());
        } else {
          try {
            const followResponse = await axios.post(
              `${server}/user/follow`,
              {
                id: id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            if (followResponse.data.success) {
              setFollowingsId([...followingsId, id]);
              dispatch(userLoader());
            } else {
              console.log("Something went wrong....");
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchFollowers = async () => {
      try {
        const url = `${server}/user/followers/list`;

        const response = await axios.get(url, {
          withCredentials: true,
        });

        // console.log("followers", response.data.result);

        if (response.data.success) {
          setFollowersData(response.data.result);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchFollowings = async () => {
      try {
        const url = `${server}/user/followings/list`;
        const response = await axios.get(url, {
          withCredentials: true,
        });
        // console.log("followings", response.data.result);
        if (response.data.success) {
          setFollowingsData(response.data.result);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    useEffect(() => {
      if (user?.following) {
        setFollowingsId(user.following);
      }
    }, [user?.following]);

    useEffect(() => {
      if (localactive === 1) {
        fetchFollowers();
      } else {
        fetchFollowings();
      }
    }, [localactive]);

    const handleProfileClick = (Id) => {
      if (user._id === Id) {
        navigate("/profile");
      } else {
        navigate(`/profile?id=${Id}`);
      }
    };

    return (
      <div className="mt-[0.5rem] w-full text-center">
        <div className="flex justify-around">
          <Link
            to={`/follow_unfollow?activepage=1`}
            className={
              localactive === 1
                ? "text-red-400 text-xl font-semibold mb-4 cursor-pointer"
                : "text-xl font-semibold mb-4 cursor-pointer"
            }
          >
            Followers
          </Link>
          <Link
            to={`/follow_unfollow?activepage=2`}
            className={
              localactive === 2
                ? "text-red-400 text-xl font-semibold mb-4 cursor-pointer"
                : "text-xl font-semibold mb-4 cursor-pointer"
            }
          >
            Followings
          </Link>
        </div>
        <hr className="mb-2 border-black border-t-2" />

        {localactive === 1 &&
          (followersData.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center text-xl">
              There is No Followers
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {followersData?.map((follower, index) => {
                // console.log(follower);

                return (
                  <div
                    key={index}
                    className="bg-white shadow-lg md:w-full rounded-lg p-4 flex justify-between items-center text-center"
                  >
                    <div
                      className="flex items-center justify-between w-[55%] cursor-pointer"
                      onClick={() => handleProfileClick(follower._id)}
                    >
                      <img
                        src={follower?.profile_pic}
                        alt={follower?.username}
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-lg font-semibold">
                          {follower?.username.substring(0, 10)}
                        </span>
                        <span className="text-sm text-gray-500 mb-2">
                          {follower?.fullname.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(follower._id)}
                      className={`px-4 py-2 rounded ${
                        followingsId?.includes(follower._id)
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      } hover:opacity-80 transition-opacity duration-300`}
                    >
                      {followingsId?.includes(follower._id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

        {localactive === 2 &&
          (followingssData.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center text-xl">
              There is No Followings
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {followingssData?.map((follower, index) => {
                // console.log(follower);

                return (
                  <div
                    key={index}
                    className="bg-white shadow-lg md:w-full rounded-lg p-4 flex justify-between items-center text-center"
                  >
                    <div
                      className="flex items-center justify-between w-[55%] cursor-pointer"
                      onClick={() => handleProfileClick(follower._id)}
                    >
                      <img
                        src={follower?.profile_pic?.url}
                        alt={follower?.username}
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-lg font-semibold">
                          {follower?.username.substring(0, 10)}
                        </span>
                        <span className="text-sm text-gray-500 mb-2">
                          {follower?.fullname.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(follower._id)}
                      className={`px-4 py-2 rounded ${
                        followingsId?.includes(follower._id)
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      } hover:opacity-80 transition-opacity duration-300`}
                    >
                      {followingsId?.includes(follower._id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    );
  } else {
    const { user } = useSelector((state) => state.user);

    const [followingsId, setFollowingsId] = useState(user?.following || null);
    const [followersData, setFollowersData] = useState([]);
    const [followingssData, setFollowingsData] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollowToggle = async (id) => {
      try {
        const response = await axios.post(
          `${server}/user/unfollow`,
          {
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setFollowingsId(
            followingsId.filter((followingId) => followingId !== id)
          );
          dispatch(userLoader());
        } else {
          try {
            const followResponse = await axios.post(
              `${server}/user/follow`,
              {
                id: id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            if (followResponse.data.success) {
              setFollowingsId([...followingsId, id]);
              dispatch(userLoader());
            } else {
              toast.error(followResponse.data.message);
            }
          } catch (error) {
            toast.error(error.message);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchFollowers = async () => {
      try {
        const url = `${server}/user/followers/list?userid=${anotherUserId}`;

        const response = await axios.get(url, {
          withCredentials: true,
        });

        if (response.data.success) {
          setFollowersData(response.data.result);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchFollowings = async () => {
      try {
        const url = `${server}/user/followings/list?userid=${anotherUserId}`;

        const response = await axios.get(url, {
          withCredentials: true,
        });

        if (response.data.success) {
          setFollowingsData(response.data.result);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    useEffect(() => {
      if (user?.following) {
        setFollowingsId(user.following);
      }
    }, [user?.following]);

    useEffect(() => {
      if (active === 1) {
        fetchFollowers();
      } else if (active === 2) {
        fetchFollowings();
      }
    }, [active]);

    const handleProfileClick = (Id) => {
      if (user._id === Id) {
        navigate("/profile");
      } else {
        navigate(`/profile?id=${Id}`);
      }
    };

    return (
      <div className="mt-[0.5rem] w-full text-center">
        <div className="flex justify-around">
          <Link
            to={`/follow_unfollow?active=1&id=${anotherUserId}`}
            className={
              active === 1
                ? "text-red-400 text-xl font-semibold mb-4 cursor-pointer"
                : "text-xl font-semibold mb-4 cursor-pointer"
            }
            // onClick={() => setActive(1)}
          >
            Followers
          </Link>
          <Link
            to={`/follow_unfollow?active=2&id=${anotherUserId}`}
            className={
              active === 2
                ? "text-red-400 text-xl font-semibold mb-4 cursor-pointer"
                : "text-xl font-semibold mb-4 cursor-pointer"
            }
            // onClick={() => setActive(2)}
          >
            Followings
          </Link>
        </div>
        <hr className="mb-2 border-black border-t-2" />

        {active === 1 &&
          (followersData.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center text-xl">
              There is No Followers
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {followersData?.map((follower, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white shadow-lg md:w-full rounded-lg p-4 flex justify-between items-center text-center"
                  >
                    <div
                      className="flex items-center justify-between w-[55%] cursor-pointer"
                      onClick={() => handleProfileClick(follower._id)}
                    >
                      <img
                        src={follower?.profile_pic}
                        alt={follower?.username}
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-lg font-semibold">
                          {follower?.username.substring(0, 10)}
                        </span>
                        <span className="text-sm text-gray-500 mb-2">
                          {follower?.fullname.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    {follower._id !== user._id && (
                      <button
                        onClick={() => handleFollowToggle(follower._id)}
                        className={`px-4 py-2 rounded ${
                          followingsId?.includes(follower._id)
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                        } hover:opacity-80 transition-opacity duration-300`}
                      >
                        {followingsId?.includes(follower._id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        {active === 2 &&
          (followingssData.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center text-xl">
              There is No Followings
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {followingssData?.map((follower, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white shadow-lg md:w-full rounded-lg p-4 flex justify-between items-center text-center"
                  >
                    <div
                      className="flex items-center justify-between w-[55%] cursor-pointer"
                      onClick={() => handleProfileClick(follower._id)}
                    >
                      <img
                        src={follower?.profile_pic?.url}
                        alt={follower?.username}
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-lg font-semibold">
                          {follower?.username.substring(0, 10)}
                        </span>
                        <span className="text-sm text-gray-500 mb-2">
                          {follower?.fullname.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    {follower._id !== user._id && (
                      <button
                        onClick={() => handleFollowToggle(follower._id)}
                        className={`px-4 py-2 rounded ${
                          followingsId?.includes(follower._id)
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                        } hover:opacity-80 transition-opacity duration-300`}
                      >
                        {followingsId?.includes(follower._id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    );
  }
};

export default FollowUnFollow;
