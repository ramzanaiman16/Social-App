import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notFound">
      <div className="notFoundContainer">
        <h2>Page Not Found</h2>
        <Link to="/">
          <h5>Go to Home</h5>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
