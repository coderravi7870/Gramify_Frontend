import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  SignUpPage,
  HomePage,
  UploadPage,
  ProfilePage,
  FooterPage,
  EditProfilePage,
  SearchPage,
  Followpage,

} from "./Route/Route";
import { getAllUsers, userLoader } from "./Redux/Action/userAction";
import Store from "./Redux/store";
import { getAllPost } from "./Redux/Action/postAction";
import ProtectedRoute from "./ProtectorRoute/ProtectedRoute";
import { fetchAllStatus } from "./Redux/Action/statusAction";

const App = () => {
  // console.log("Ram Ram");

  useEffect(() => {
    Store.dispatch(userLoader());
    Store.dispatch(getAllPost());
    Store.dispatch(getAllUsers());
    Store.dispatch(fetchAllStatus());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/follow_unfollow" element={<Followpage />} />
      </Routes>
      <FooterPage />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </BrowserRouter>
  );
};

export default App;
