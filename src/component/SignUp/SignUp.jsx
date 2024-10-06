import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const Singup = () => {
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = `${server}/user/signup`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          fullname: fullName,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("signup Successfully");
        navigate("/login");
        setUserName("");
        setFullName("");
        setEmail("");
        setPassword("");
      } else {
        console.error("Error:", response.statusText);
        toast.error(result.message)
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };
  return (
    <div className="bg-white h-screen w-full flex items-center justify-center text-white">
      <div className="relative w-full max-w-md mx-4 sm:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 rounded-lg shadow-2xl bg-cover bg-center bg-black  overflow-hidden">
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
              <label htmlFor="username" className="block font-sans font-bold">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={userName}
                required
                className="text-black py-2 px-3 my-1 text-sm rounded-lg outline-none focus:outline-sky-400 w-full"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fullname" className="block font-sans font-bold">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                value={fullName}
                required
                className="text-black py-2 px-3 my-1 text-sm rounded-lg outline-none focus:outline-sky-400 w-full"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
                  className="absolute right-2 top-8 cursor-pointer text-black"
                  size={22}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-2 top-8 cursor-pointer text-black"
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
          <div className="font-serif">If have an Account then go for-{'>'} <span className="text-blue-600"><Link to="/login">Login</Link></span></div>
        </div>
      </div>
    </div>
  );
};

export default Singup;
