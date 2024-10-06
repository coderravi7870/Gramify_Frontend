import React, { useEffect, useState } from "react";
import { FaHome, FaSearch, FaPlusSquare, FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoader } from "../../Redux/Action/userAction";

const Footer = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 p-2 z-40 sm:hidden">
        <div className="flex justify-around items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
            }
          >
            <FaHome className="text-2xl" />
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
            }
          >
            <FaSearch className="text-2xl" />
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
            }
          >
            <FaPlusSquare className="text-2xl text-gray-500 hover:text-blue-500 cursor-pointer" />
          </NavLink>



          {!user ? (
            <NavLink to="/login">
              <FaUserCircle className="text-2xl" />
            </NavLink>
          ) : (
            <NavLink to="/profile">
              <img
                src={user?.profile_pic?.url}
                alt="pic"
                className=" w-[35px] h-[35px]  bg-white flex justify-center items-center object-cover rounded-full"
              />
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
};

export default Footer;
