import React, {  useEffect } from "react";
import { Button } from 'react-bootstrap';
import axios from "axios";
import Cookies from "js-cookie";
import music_note from "./music/music.png"

function Welcome({ hasLoggedIn }){

    const token_key = 'arcane-token-key';

    const [quote, setQuote] = React.useState("");

    useEffect(() => {
        async function fetchQuote() {
            try {
                const response = await fetch('https://api.quotable.io/random'); //used the following API: https://github.com/lukePeavey/quotable
                const data = await response.json();
                //console.log(`${data.content} —${data.author}`);
                setQuote(`${data.content} —${data.author}`);
            } catch (error) {
              console.log(error);
            }
        }
      
        fetchQuote();

      }, []);
    
    return(
        <div class="p-2 mx-auto my-auto">
            <div class="flex flex-auto flex-column flex center mx-auto my-auto p-4">
                <div class="flex flex-auto flex-row flex-wrap flex-center mx-auto">
                    <img src={music_note} class="mx-auto"/>
                    <h4>Welcome to Arcane!</h4>
                    <img src={music_note} class="mx-auto"/>
                    <br />
                </div>
                <br />
                <sub class="text-muted my-10 mx-auto">{quote}</sub>
                <br />
                <small class="text-muted my-10">Here's how it works: login with your Spotify account. Then, select up to five of your favorite songs to be the seeds for your curated mix. Then plug in some headphones and enjoy your own Arcane experience!</small>
                <br />
            </div>
            { hasLoggedIn ?
                <div></div>
                :
                <a href="/api/login">
                    <Button class="bg-gray-800" variant="secondary btn-lg">
                        Log in with Spotify!
                    </Button>
                </a>
            }
        </div>
    );
}


export default Welcome;