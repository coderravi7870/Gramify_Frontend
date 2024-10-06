// import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoader } from "../../Redux/Action/userAction";
import axios from "axios";
import { server } from "../../server/server";
import { toast } from "react-toastify";

const Editprofile = () => {
  const { user, isLoding } = useSelector((state) => state.user);
//   console.log(isLoding);

  const [fullName, setFullName] = useState(user?.fullname || "");
  const [userName, setUserName] = useState(user?.username || "");
  const [biod, setBiod] = useState(user?.bio || "");
  const [websiteDetails, setwebsiteDetails] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
 

  useEffect(() => {
    if (user) {
      setFullName(user.fullname);
      setUserName(user.username);
      setBiod(user.bio);
    }
  }, [user]);

  const handleSubmite = async () => {
    await axios
      .put(
        `${server}/user/profile/update`,
        { username:userName, bio:biod, fullname:fullName },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          dispatch(userLoader());
          navigate("/profile");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleAvatarChange = async (e) => {
    const newForm = new FormData();
    newForm.append("avatar", e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, newForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Avatar updated successfully!");
          dispatch(userLoader());
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((err) => toast.error(err));
  };

  return (
    <>
      {isLoding ? (
        <div>Loading...</div>
      ) : (
        <div className="px-4 mt-3 sm:ml-44">
          <div className="flex justify-between items-center">
            <div className="text-xl mr-2 flex justify-center items-center">
              <span className="font-bold sm:text-xl  ml-3">Edit Profile</span>
            </div>
            <div
              className="text-blue-700 font-semibold cursor-pointer hover:text-red-300"
              onClick={handleSubmite}
            >
              Done
            </div>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4 mt-10">
            <img
              src={user?.profile_pic?.url}
              alt="profilepic"
              className="w-20 h-20 md:w-40 md:h-40 rounded-full border border-blue-500"
            />
            <div className="text-blue-500 font-semibold cursor-pointer">
              <label htmlFor="avatar" className="cursor-pointer">
                Edit picture
              </label>
              <input
                type="file"
                id="avatar"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4 md:justify-center md:items-center md:border md:border-spacing-2 md:shadow-2xl p-2">
            <div className="flex flex-col md:w-[50%]">
              <label className="text-gray-400 md:text-xl mb-1">Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="focus:outline-blue-400 border border-spacing-2 px-2 text-xl py-1 md:w-full rounded-xl"
              />
            </div>
            <div className="flex flex-col md:w-[50%]">
              <label className="text-gray-400 md:text-xl mb-1">Username</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="focus:outline-blue-400 border border-spacing-2 px-2 text-xl py-1 md:w-full rounded-xl"
              />
            </div>
            <div className="flex flex-col md:w-[50%]">
              <label className="text-gray-400 md:text-xl mb-1">Bio</label>
              <input
                type="text"
                value={biod}
                onChange={(e) => setBiod(e.target.value)}
                className="focus:outline-blue-400 border border-spacing-2 px-2 text-xl py-1 md:w-full rounded-xl"
              />
            </div>

            <div className="flex flex-col md:w-[50%]">
              <label className="text-gray-400 md:text-xl mb-1">Website</label>
              <input
                type="text"
                value={websiteDetails}
                className="focus:outline-blue-400 border border-spacing-2 px-2 text-xl py-1 md:w-full rounded-xl"
                onChange={(e) => setwebsiteDetails(e.target.value)}
              />
            </div>
            <div className="text-blue-500 font-semibold">
              Personal infrormation settings
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Editprofile;
