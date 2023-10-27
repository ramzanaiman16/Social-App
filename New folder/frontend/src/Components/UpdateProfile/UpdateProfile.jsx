import { Avatar, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UpdateProfile.css";
import { loadUser, updateProfile } from "../../Actions/User";
import Loader from "../Loader/Loader";

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState("");
  const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPrev(reader.result);
        setAvatar(reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(name, email, avatar));
    dispatch(loadUser());
  };

  return (
    <div className="updateProfile">
      <form className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>

        <Avatar
          src={avatarPrev}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <input
          type="text"
          value={name}
          placeholder="Name"
          className="updateProfileInputs"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="updateProfileInputs"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit">Update</Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
