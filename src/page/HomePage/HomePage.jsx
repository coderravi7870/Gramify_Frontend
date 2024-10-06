import React from "react";
import HomeSideBar from "../../component/Home/HomeSideBar";
import AllPost from "../../component/Home/AllPost";

const HomePage = () => {
  return (
    <div className="flex w-full">
      <HomeSideBar />
      <div className="w-full">
        <AllPost />
      </div>
    </div>
  );
};

export default HomePage;
