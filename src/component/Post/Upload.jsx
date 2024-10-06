import axios from "axios";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server/server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllPost } from "../../Redux/Action/postAction";
import { useDispatch } from "react-redux";
import { userLoader } from "../../Redux/Action/userAction";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hanldeFile = async (e) => {
    setFile(e.target.files[0]);
  };

  const handlgePost = async () => {
    const newForm = new FormData();
    if (file) {
      newForm.append("file", file);
      newForm.append("caption", caption);

      await axios
        .post(`${server}/posts/upload`, newForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success) {  // Checking success on res.data
            toast.success("Uploaded file successfully!");
            navigate("/");
            window.location.reload();
          } else {
            toast.error("Failed to upload file");
          }
        })
        .catch((err) => toast.error(err.message))
    }
  };


  return (
    <div className="bg-slate-300 flex w-full justify-center items-center h-screen">
      <div className="w-max bg-slate-50 px-4 rounded-sm ">
        <div>
          <h1 className="text-[20px] font-bold text-center p-4">
            Upload Your Post
          </h1>
          <div className="mt-4">
            <div>
              <input type="file" name="" id="" onChange={hanldeFile} />
            </div>
            {file && (
              <>
                <div className="w-[200px] h-[200px] flex justify-center items-center border border-gray-300 bg-no-repeat mt-2 relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="pic"
                    className="object-contain h-full w-full"
                  />
                  <RxCross1
                    className="absolute top-1 right-2 font-bold cursor-pointer"
                    size={20}
                    onClick={() => setFile(null)}
                  />
                </div>
              </>
            )}
            <div className="mt-4">
              <label className="block text-xl font-bold mb-1">Caption</label>
              <textarea
                name="caption"
                cols={30}
                rows={5}
                className="focus:outline-blue-500 bg-slate-100 px-3 py-2"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="w-full flex justify-center pb-4 mt-2">
            <button
              className="bg-blue-700 w-[100px] rounded-md hover:bg-blue-500 py-1 px-2 font-bold"
              onClick={handlgePost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
