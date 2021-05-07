import React, { useEffect, useState } from "react";
import Welcome from './Welcome';
import SearchTrack from './SearchTrack';
import DisplaySeeds from './DisplaySeeds';
import DisplayRecommendations from './DisplayRecommendations';
import CreatePlaylist from './CreatePlaylist'
import Cookies from "js-cookie";
var _ = require('underscore');




function App() {

  const[seedTracks, setSeedTracks] = useState([]);
  const[recommendations, setRecommendations] = useState([]);
  const token_key = 'arcane-token-key';
  const[hasLoggedIn, setHasLoggedIn] = useState(false);

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

  function checkForToken(){
    if(Cookies.get(token_key) == undefined || Cookies.get(token_key) == null){
        setHasLoggedIn(false);
    }
    else{
      setHasLoggedIn(true);
    }
}

  useEffect(() => {
    checkForToken();
    console.log(hasLoggedIn);
    return hasLoggedIn;
  }, []);
  


  return (
    <div className="App">
      <header className="App-header">
        <div class="w-11/12">
          <Welcome  hasLoggedIn={hasLoggedIn}/>
          <SearchTrack seedTracks={seedTracks} updateSeeds={updateSeeds} />
          <DisplaySeeds seedTracks={seedTracks} deleteSeed={deleteSeed}/>
          <DisplayRecommendations seedTracks={seedTracks} recommendations={recommendations} updateRecommendations={updateRecommendations} deleteRecommendation={deleteRecommendation}/>
          <CreatePlaylist seedTracks={seedTracks} recommendations={recommendations}/>
        </div>
      </header>
    </div>
  );
}

export default App;
