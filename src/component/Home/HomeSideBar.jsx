import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server/server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { IoIosNotificationsOutline } from "react-icons/io";

const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  const [openLougout, setOpenLougout] = useState(false);

  //  console.log(user);
  const navigate = useNavigate();

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
        console.log(response.data);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          navigate("/login");
          window.location.reload();
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      {/* big screen */}
      <div className="hidden lg:w-[250px] sm:w-[150px] md:w-[200px] bg-gray-800 h-screen sm:flex flex-col items-center py-8 sticky top-0">
        {/* Logo or Brand */}
        <div className="mb-8">
          <Link to="/" className="flex items-center flex-col">
            <img
              src="/Images/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-3xl"
            />
            <span className="text-xl font-bold ml-2 text-white">Gramify</span>
          </Link>
        </div>
        {/* Navigation Links */}

        <div className="flex flex-col space-y-6 w-full px-4 justify-center items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center justify-start text-yellow-300 bg-gray-600 p-3 rounded-md transition-all"
                : "flex items-center justify-start text-white hover:bg-gray-600 hover:text-yellow-300 p-3 rounded-md transition-all"
            }
          >
            <span className="text-lg font-semibold">Home</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "flex items-center justify-start text-yellow-300 bg-gray-600 p-3 rounded-md transition-all"
                : "flex items-center justify-start text-white hover:bg-gray-600 hover:text-yellow-300 p-3 rounded-md transition-all"
            }
          >
            <span className="text-lg font-semibold">Search</span>
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive
                ? "flex items-center justify-start text-yellow-300 bg-gray-600 p-3 rounded-md transition-all"
                : "flex items-center justify-start text-white hover:bg-gray-600 hover:text-yellow-300 p-3 rounded-md transition-all"
            }
          >
            <span className="text-lg font-semibold">Upload</span>
          </NavLink>

          <div className="relative">
            <h1 className="flex items-center justify-start text-white hover:bg-gray-600 hover:text-yellow-300 p-3 rounded-md transition-all cursor-pointer">
              <span
                className="text-lg font-semibold"
                onClick={() => setOpenLougout(!openLougout)}
              >
                Logout
              </span>
            </h1>
            {openLougout && (
              <div className="absolute bg-[#fff] shadow-2xl p-2 w-[150px] ">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    onClick={() => setOpenLougout(!openLougout)}
                  />
                </div>
                <div className="mt-2">
                  Logout{"  "}
                  <span
                    className="bg-blue-600 px-2 rounded-xl cursor-pointer hover:bg-blue-500 py-2"
                    onClick={handleLogout}
                  >
                    Conform
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="h-[100px]">
            {!user ? (
              <Link to="/login">
                <CgProfile size={60} className="mt-10" />
              </Link>
            ) : (
              <Link to="/profile">
                <img
                  src={user?.profile_pic?.url}
                  alt="pic"
                  className=" w-[60px] h-[60px]  bg-white flex justify-center items-center object-cover rounded-full mt-10"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile screen navigation (visible only on small screens) */}
      {/* <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-300 h-[50px] flex justify-around items-center shadow-lg py-2">
        <NavLink to="/" className="flex flex-col items-center">
          <span className="text-3xl">🏠</span>
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center">
          <span className="text-3xl">ℹ️</span>
        </NavLink>

        <NavLink to="/search" className="flex flex-col items-center">
          <span className="text-3xl">🔍</span>
        </NavLink>

        <NavLink to="/upload" className="flex flex-col items-center">
          <span className="text-3xl">📤</span>
        </NavLink>

        <span className="text-2xl">
          {!user ? (
            <Link to="/login">
              <CgProfile size={30} /> 
            </Link>
          ) : (
            <Link to="/profile">
              <img
                src={user?.profile_pic?.url}
                alt="pic"
                className=" w-[30px] h-[30px]  bg-white flex justify-center items-center object-cover rounded-full"
              />
            </Link>
          )}
        </span>
      </div> */}
    </>
  );
};

export default HomePage;
