import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuthenticatedHOC = (Component) => {
    
    const [token, setToken] = useState('');

    useEffect(() => {
        setToken(localStorage.getItem('arcane-token-key'));
    }, []);
    
    return (props) => {

    
    if (token != null && token != ''){
        return <Component {...props} />;
    }



    //we will return nothing later
    return (
      <div>
        <h4>You must be logged in to view</h4>
        <a href = "http://localhost:3000">Click here to return to the login</a>
      </div>
    );
  };
};

export default AuthenticatedHOC;