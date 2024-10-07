import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {server} from "../../server/server";
import axios from "axios";
import {toast} from "react-toastify"

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${server}/user/login`, {
      email, 
      password
    }, {
      withCredentials: true  // Important for sending cookies
    })
    .then((result) => {
      if (result.data?.success) {
        toast.success(result?.data?.message);
        navigate("/");
        setEmail("");
        setPassword("");
        window.location.reload();
      } else {
        toast.error(result?.data?.message || "Login failed");
      }
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || "An error occurred");
      } else {
        toast.error("Network error or server is unreachable");
      }
    });
  };
  return (
    <div className="bg-white h-screen w-full flex items-center justify-center z-50 text-white">
      <div className="relative w-full max-w-md mx-4 sm:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 rounded-lg shadow-2xl bg-cover bg-center bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: "url(/Images/nature.jpg)",
          }}
        ></div>
        <div className="relative z-10">
          <h1 className="text-center text-2xl font-serif font-bold">
            Login to Account
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block font-sans font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                required
                className="text-black py-2 px-3 my-1 text-sm rounded-lg outline-none focus:outline-sky-400 w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block font-sans font-bold">
                Password
              </label>
              <input
                type={visible ? "text" : "password"}
                name="password"
                value={password}
                required
                className="text-black py-2 px-3 my-1 text-sm rounded-lg outline-none focus:outline-sky-400 w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
              {visible ? (
                <AiOutlineEye
                  className="text-black absolute right-2 top-8 cursor-pointer"
                  size={22}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="text-black absolute right-2 top-8 cursor-pointer"
                  size={22}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
          <div className="font-serif">If no Account then go for-{'>'} <span className="text-blue-600"><Link to="/sign-up">SingUp</Link></span></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
