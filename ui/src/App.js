import React, { useEffect, useState } from "react";
import Welcome from './Welcome';
import SearchTrack from './SearchTrack';
import DisplaySeeds from './DisplaySeeds';
import DisplayRecommendations from './DisplayRecommendations';
import CreatePlaylist from './CreatePlaylist'
import Cookies from "js-cookie";
import './App.css'; 
var _ = require('underscore');


function App() {

  const[seedTracks, setSeedTracks] = useState([]);
  const[recommendations, setRecommendations] = useState([]);
  const token_key = 'arcane-token-key';
  const[hasLoggedIn, setHasLoggedIn] = useState(false);
  const[background, setBackground] = useState("");


  const updateSeeds = (trackArray, newTrack) => {
    trackArray.push(newTrack);
    setSeedTracks([...trackArray]);
  }

  const deleteSeed = (trackArray, trackToBeDeleted) => {
    trackArray = _.without(trackArray, trackToBeDeleted);
    setSeedTracks([...trackArray]);
  }

  const updateRecommendations = (trackArray, newTrack) => {
    trackArray.push(newTrack);
    setRecommendations([...trackArray]);
  }

  const deleteRecommendation = (trackArray, trackToBeDeleted) => {
    trackArray = _.without(trackArray, trackToBeDeleted);
    setRecommendations([...trackArray]);
  }

  const clearRecommendations = (trackArray) => {
    let length = recommendations.length;
    for(let i = 0; i < length; i++){
      trackArray.pop();
    }
    setRecommendations([...trackArray]);
  }

  function checkForToken(){
      if(Cookies.get(token_key) == undefined || Cookies.get(token_key) == null){
        return false;
      }
      else{
        return true;
      }
  }
  function updateHasLoggedIn(){
    if(Cookies.get(token_key) == undefined || Cookies.get(token_key) == null){
      setHasLoggedIn(false);
    }
    else{
      setHasLoggedIn(true);
    }
  }

  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function setCookie(){
      Cookies.remove(token_key);
      var params = getHashParams();
      if(params.access_token != null && params.access_token != ''){
          Cookies.set(token_key, params.access_token, { expires: 3599/86400 }) //set the cookie to expire after 59 min and 59 sec 
      }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function generateBackground(){
    if(background == ""){
      let randomNumber = getRandomInt(40);
      let backgroundClassname = "App-background" + randomNumber.toString();
      setBackground(backgroundClassname);
    }
    return background;
  }

  useEffect(() => {
    if(!hasLoggedIn){
      Cookies.remove(token_key);
    }
    updateHasLoggedIn();
    var params = getHashParams();
    let bool = false;
    if(params.access_token != null && params.access_token != ''){
      bool = true;
      
    }
    if(checkForToken() == false && bool == true){
      setCookie();
    }
    updateHasLoggedIn();
  }, []);
  
  const content = (
    <header className="App-header2">
        <Welcome  hasLoggedIn={hasLoggedIn} setHasLoggedIn={setHasLoggedIn}/>
        <header className="App-header">
          <div class="w-11/12">
            <SearchTrack seedTracks={seedTracks} updateSeeds={updateSeeds} hasLoggedIn={hasLoggedIn}/>
            <DisplaySeeds seedTracks={seedTracks} deleteSeed={deleteSeed}/>
            <DisplayRecommendations seedTracks={seedTracks} recommendations={recommendations} updateRecommendations={updateRecommendations} deleteRecommendation={deleteRecommendation} clearRecommendations={clearRecommendations}/>
            <CreatePlaylist seedTracks={seedTracks} recommendations={recommendations}/>
          </div>
        </header>
    </header>
  );


  return (

    <div className="App">
      <div className={generateBackground()}>
        <div class="overscroll-contain">
          {content}
        </div>
      </div>
    </div>
    
  );
}

export default App;
