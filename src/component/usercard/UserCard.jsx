import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { userLoader } from "../../Redux/Action/userAction";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { server } from "../../server/server";

const UserCard = ({ user, mainuser }) => {
 

  const [followingsId, setFollowingsId] = useState(mainuser?.following);


  const dispatch = useDispatch();

  const handleFollow = async (id) => {

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
      // console.log(followResponse.data);
      if (followResponse.data.success) {
        setFollowingsId([...followingsId, id]);
        dispatch(userLoader());
      } else {
        toast.error(followResponse.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnFollow = async (id) => {
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // console.log(user);
  

  return (
    <div className="w-[150px] bg-[#0000004b] shadow-md rounded-sm hover:scale-110 duration-300">
      <div className="w-full flex flex-col justify-center items-center p-2">
        <Link
          to={
            user?._id !== mainuser?._id
              ? `/profile?id=${user?._id}`
              : `/profile`
          }
        >
          <img
            src={user?.profile_pic?.url}
            alt="pic"
            className="w-[80px] h-[80px] border border-blue-400 object-cover rounded-full cursor-pointer"
          />
        <h1 className="text-center">{user?.fullname?.substring(0, 10)}...</h1>
        </Link>
        {followingsId?.includes(user?._id) ? (
          <button
            className="bg-red-400 mt-4 px-6 py-1 rounded-lg hover:bg-red-500"
            onClick={() => handleUnFollow(user?._id)}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="bg-blue-600 mt-4 px-6 py-1 rounded-lg hover:bg-blue-500"
            onClick={() => handleFollow(user?._id)}
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
