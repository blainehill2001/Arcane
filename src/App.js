import React, { Component, useEffect, useState } from "react";
import './App.css';
import Spotify from 'spotify-web-api-js';
import Welcome from './Welcome';
import Search from './Search';
import AuthenticatedHOC from './AuthenticatedHOC';
import axios from 'axios';
const spotifyWebApi = new Spotify();


function App() {

//   const token_key = 'arcane-token-key';

//   const [token, setToken] = useState('');


//   const [wrappedSearch, setWrappedSearch] = useState(null);

//   function getHashParams() {
//     var hashParams = {};
//     var e, r = /([^&;=]+)=?([^&;]*)/g,
//         q = window.location.hash.substring(1);
//     while ( e = r.exec(q)) {
//        hashParams[e[1]] = decodeURIComponent(e[2]);
//     }
//     //console.log(hashParams);
//     return hashParams;
// }

  // useEffect(() => {
  //   // if(sessionStorage.getItem(token_key)){
  //   //   sessionStorage.removeItem(token_key);
  //   //   console.log("the session storage was cleared");
  //   // }
  //   // var params = getHashParams();
  //   // setToken(params.access_token);
  //   // if(token == undefined){
  //   //   localStorage.setItem(token_key, token);
  //   //   console.log("The access token is "+params.access_token);
  //   // }

  //   setWrappedSearch(AuthenticatedHOC(Search));
  //   //const WrappedSearch = AuthenticatedHOC(Search);

  // }, []);

  const WrappedSearch = AuthenticatedHOC(Search);
  

  return (
    <div className="App">
        <header className="App-header">
            {
            localStorage.getItem("arcane-token-key") == null && 
              <Welcome />
            }
            <WrappedSearch />
        </header>
    </div>
  );
}

export default App;
