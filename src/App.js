import React, { Component, useEffect, useState } from "react";
//import './App.css';
import Spotify from 'spotify-web-api-js';
import Welcome from './Welcome';
import SearchTrack from './SearchTrack';
import AuthenticatedHOC from './AuthenticatedHOC';
import DisplaySeeds from './DisplaySeeds';
import axios from 'axios';
const spotifyWebApi = new Spotify();
var _ = require('underscore');




function App() {

  const[seedTracks, setSeedTracks] = useState([]);

  const updateSeedTrack = (trackArray, newTrack) => {
    trackArray.push(newTrack);
    setSeedTracks([...trackArray]);
  }

  const deleteSeedTrack = (trackArray, trackToBeDeleted) => {
    trackArray = _.without(trackArray, trackToBeDeleted);
    setSeedTracks([...trackArray]);
  }


  // const WrappedSearchTrack = AuthenticatedHOC(SearchTrack);
  // const WrappedDisplaySeeds = AuthenticatedHOC(DisplaySeeds);
  

  return (
    <div className="App">
        <header className="App-header">
          <div class="w-11/12">
            {
            localStorage.getItem("arcane-token-key") == null && 
              <Welcome />
            }
            {/* <WrappedSearchTrack />

            <WrappedDisplaySeeds /> */}

            <SearchTrack seedTracks={seedTracks} updateSeedTrack={updateSeedTrack} />
            <DisplaySeeds seedTracks={seedTracks} deleteSeedTrack={deleteSeedTrack}/>
          </div>
        </header>
    </div>
  );
}

export default App;
