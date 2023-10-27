import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewPost } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image));
    dispatch(loadUser());
  };

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <h3>New Post</h3>

        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default NewPost;
