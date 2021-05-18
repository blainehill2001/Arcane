import React, {  useEffect } from "react";
import { Button } from 'react-bootstrap';
import axios from "axios";
import Cookies from "js-cookie";
import music_note from "./assets/music.png"


function Welcome({ hasLoggedIn }){

    const token_key = 'arcane-token-key';

    let url;
    if (process.env.NODE_ENV == "production") {
        url = "/api/login";
    } else {
        url = "http://localhost:3001/api/login";
    }
    
    return(
        //we will have a logout button at the top when we're logged in and we will remove the login and introductory information once we are logged in
        <div class="p-2 mx-auto my-auto">
            <div class="flex flex-auto flex-column flex center mx-auto my-auto p-4">
                <div class="flex flex-auto flex-row flex-wrap flex-center mx-auto my-4 px-4 py-4 ring ring-transparent rounded-lg bg-green-700">
                    <img src={music_note}/>
                    <h4>Welcome to Arcane!</h4>
                    <img src={music_note}/>
                    <br />
                </div>
                <br />
                <small class="text-muted text-center my-10">Here's how it works: login with your Spotify account. Then, select up to five of your favorite songs to be the seeds for your curated mix. Then plug in some headphones and enjoy your own Arcane experience!</small>
                <br />
            </div>
            { hasLoggedIn ?
                <div></div>
                :
                <a href={url}>
                    <Button class="bg-gray-800" variant="secondary btn-lg">
                        Log in with Spotify!
                    </Button>
                </a>
            }
        </div>
    );
}


export default Welcome;