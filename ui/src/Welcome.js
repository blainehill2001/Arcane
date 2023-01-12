import React from "react";
import { Button } from "react-bootstrap";
import Cookies from "js-cookie";
import music_note from "./assets/music.png";
import github_logo from "./assets/github.svg";

function Welcome({ hasLoggedIn, setHasLoggedIn }) {
  const token_key = "arcane-token-key";

  let url;
  if (process.env.NODE_ENV == "production") {
    url = "/api/login";
  } else {
    url = "http://localhost:3001/api/login";
  }

  let url2;
  if (process.env.NODE_ENV == "production") {
    url2 = process.env.APP_URL;
  } else {
    url2 = "http://localhost:3000/";
  }

  function logout() {
    Cookies.remove(token_key);
    Cookies.remove("spotify_auth_state");
    setHasLoggedIn(false);
  }

  return (
    <div>
      <div class="flex flex-wrap flex-1 justify-between flex-row ring ring-transparent p-3">
        <a href={url2}>
          <img src={music_note} />
        </a>
        <a href="https://github.com/blainehill2001/Arcane" class="my-auto">
          <img src={github_logo} />
        </a>
      </div>

      {hasLoggedIn ? (
        <div>
          <div class="flex flex-column justify-center items-center">
            <div class="mx-auto px-3 py-3 ring ring-transparent rounded-lg bg-green-700">
              <Button
                class="bg-gray-800"
                variant="secondary btn-lg"
                onClick={logout}
                href={url2}
              >
                Log out of Spotify
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div class="flex flex-column justify-center items-center">
          <div class="mx-10 sm:mx-20 md:mx-30 lg:mx-40 px-3 py-3 ring ring-transparent rounded-lg bg-green-700">
            <h2>Welcome to Arcane!</h2>
            <p class="p-3 text-xs sm:text-sm md:text-base">
              Here's how it works: login with your Spotify account. Then, select
              up to five of your favorite songs to be the seeds for your curated
              mix. Then plug in some headphones and enjoy your own Arcane
              experience!
            </p>
            <a href={url}>
              <Button class="bg-gray-800" variant="secondary btn-lg">
                Log in with Spotify!
              </Button>
            </a>
            <div class="py-3 px-5 flex flex-row flex-auto flex-wrap justify-between text-super-duper-small sm:text-super-small md:text-xs lg:text-sm">
              <a href="https://icons8.com/">Icons by Icons8</a>
              <a>
                By using this app, you consent to cookie usage to generate
                awesome music!
              </a>
              <a href="https://www.heropatterns.com/">
                Backgrounds by Hero Patterns
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
