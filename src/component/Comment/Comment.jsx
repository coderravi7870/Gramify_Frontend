import React, { useEffect, useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { useSelector } from "react-redux";
import { server } from "../../server/server";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Comment = ({ isOpen, onClose, userDetails, postId ,fetchCommentsList}) => {
  const navigate = useNavigate();
  
  const [openReplies, setOpenReplies] = useState({});
  const [toggleReply, setToggleReply] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [replayText, setReplayText] = useState("");


  

  if (!isOpen) return null;

  const handleSubmitbtn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${server}/post/comments/add`,
        {
          post_id: postId,
          text: textInput,
        },
        {
          headers: {
            "content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setTextInput("");
        fetchCommentsList(postId);
      } else {
        toast.error(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReplySubmitbtn = async (parent_id) => {
    try {
      const response = await axios.post(
        `${server}/post/comments/add`,
        {
          post_id: postId,
          text: replayText,
          parent_id: parent_id,
        },
        {
          headers: {
            "content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setToggleReply(null);
        setReplayText("");
        fetchCommentsList(postId);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReplyToggle = (commentId) => {
    setToggleReply(commentId);
  };

  const handleReplyViewHide = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };



  // Recursive function to render comments and their replies
  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div
        key={comment._id}
        className={`relative mb-2 ${!comment.parent_id ? "w-full" : "pl-4"}`}
      >
        <div
          className={`border border-spacing-2 px-2 py-2 flex flex-col items-center ${
            !comment.parent_id ? "bg-white" : "bg-gray-100"
          }`}
        >
          <div className="w-full flex">
            <div className="flex items-center space-x-2">
              <img
                src={comment?.user_details?.profile_pic}
                alt="logo"
                className="rounded-full w-9 h-9"
              />
              <div className="flex flex-col">
                <div className="font-bold">
                  {comment?.user_details?.username}
                </div>
                <div>{comment.text} </div>
              </div>
            </div>
      
          </div>
          <div className="mt-2">
            {
              <>
                <spane
                  className="ml-10 mr-10 font-bold text-gray-700 hover:text-gray-500 relative"
                  onClick={() => handleReplyToggle(comment._id)}
                >
                  Replay
                </spane>
                {toggleReply === comment._id && (
                  <div className=" bg-slate-200 absolute z-10">
                    <div className="w-full justify-center items-center p-2 ">
                      <div className="flex justify-end mb-1">
                        <RxCross1
                          size={20}
                          onClick={() => setToggleReply(null)}
                        />
                      </div>
                      <textarea
                        row={10}
                        className="w-full h-24 p-1 m-0 border-none outline-none resize-none border border-spacing-1"
                        value={replayText}
                        onChange={(e) => setReplayText(e.target.value)}
                      ></textarea>
                      <div className="w-full flex justify-center items-center mt-1">
                        <button
                          className="bg-blue-600 px-2 rounded-md text-white w-[100px] hover:bg-blue-400"
                          onClick={() => handleReplySubmitbtn(comment._id)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            }
            {comment.replies.length > 0 && (
              <span
                className="text-red-500 ml-3 cursor-pointer"
                onClick={() => handleReplyViewHide(comment._id)}
              >
                <span className="font-bold text-xl">.</span>{" "}
                {openReplies[comment._id] ? "Hide Replies" : "View Replies"}
              </span>
            )}
          </div>
        </div>

        {openReplies[comment._id] && comment.replies.length > 0 && (
          <div className="pl-4">{renderComments(comment.replies)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5">
      <div className="bg-white w-full h-full sm:h-min md:w-1/2 lg:w-1/3 p-4 sm:rounded-lg sm:ml-44">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Comments ({userDetails[postId]?.length})
          </h2>
          <button onClick={onClose} className="text-lg font-bold">
            <RxCross1 size={30} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
          {userDetails[postId]?.length > 0 ? (
            renderComments(userDetails[postId])
          ) : (
            <p>No comments available.</p>
          )}
        </div>
        <form
          className=" w-full mt-4 fixed bottom-8 sm:static"
          onSubmit={handleSubmitbtn}
        >
          <div className=" relative flex items-center">
            <input
              type="text"
              value={textInput}
              required
              placeholder="Add a comment..."
              className="w-[90%] p-2 border border-gray-300 rounded pr-16 focus:outline-none" // Adjust padding for text and button
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              type="submit" // Ensure this is a submit button for form submission
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-700 focus:outline-none transition duration-300 ease-in-out"
            >
              <span className="font-semibold text-lg">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comment;
