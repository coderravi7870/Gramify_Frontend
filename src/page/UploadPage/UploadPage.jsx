import React from "react";
import HomeSideBar from "../../component/Home/HomeSideBar";
import Upload from "../../component/Post/Upload";

const UploadPage = () => {
  return (
    <div className="flex w-full">
      <HomeSideBar />
      <div className="w-full">
        <Upload />
      </div>
    </div>
  );
};

export default UploadPage;
