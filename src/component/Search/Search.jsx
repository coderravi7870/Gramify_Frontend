import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import UserCard from "../../component/usercard/UserCard.jsx";
import { useSelector } from "react-redux";
import { Vortex } from "react-loader-spinner";

const Search = () => {
  const { alluser, user, isLoding } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [alluserData, setAlluserData] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filterProducts = alluser?.filter(
      (userdata) =>
        userdata.fullname.toLowerCase().includes(term.toLowerCase()) ||
        userdata.username.toLowerCase().includes(term.toLowerCase())
    );

    setAlluserData(filterProducts);
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
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      ) : (
        <>
          {" "}
          <div>
            <div className="w-full bg-white shadow-md rounded-lg py-6 px-4 sticky top-0">
              <div className="flex items-center justify-center">
                <div className="relative w-full sm:w-[60%]">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <FaSearch
                    size={20}
                    className="absolute right-2 top-2.5 text-gray-500 hover:text-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="w-full  flex flex-wrap gap-4 justify-center mt-2 ">
              {alluserData === null
                ? alluser
                    ?.filter((userdata) => userdata?._id !== user?._id)
                    ?.map((userdata, i) => {
                      // console.log(user);

                      return (
                        <div key={i}>
                          <UserCard user={userdata} mainuser={user} />
                        </div>
                      );
                    })
                : alluserData
                    ?.filter((userdata) => userdata?._id !== user?._id)
                    ?.map((userdata, i) => {
                      // console.log(user);

                      return (
                        <div key={i}>
                          <UserCard user={userdata} mainuser={user} />
                        </div>
                      );
                    })}
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
};

export default Search;
