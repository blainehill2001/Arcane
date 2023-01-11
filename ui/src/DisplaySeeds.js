// import React from "react";

const DisplaySeeds = ({ seedTracks, deleteSeed }) => {
  return (
    <div>
      {seedTracks.length > 0 && (
        <div class="mx-8 my-20 px-4 py-4 ring ring-transparent rounded-lg bg-green-700">
          <h2>Your Seeds are:</h2>
          <div class="flex flex-row flex-wrap">
            {seedTracks.map((seedTrack) => {
              return (
                <div
                  class="container mx-auto w-1/2 lg:w-1/5 md:w-1/3 p-3 h-full"
                  key={seedTrack.id}
                  id="heightgrabber"
                >
                  <button
                    name={seedTrack.name}
                    class="w-full h-full p-4 ring ring-transparent rounded-lg bg-green-800 hover:bg-blue-500 active:bg-indigo-800"
                    onClick={() => deleteSeed(seedTracks, seedTrack)}
                  >
                    <img
                      src={seedTrack.album.images[0].url}
                      class="object-scale-down"
                    />
                    <div class="flex flex-row flex-wrap justify-around">
                      <p class="p-1 text-xs sm:text-sm md:text-base lg:text-lg">
                        {seedTrack.name} <br />{" "}
                        <i>by {seedTrack.artists[0].name}</i>
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
            {[...Array(5 - (seedTracks.length || 0))].map((i) => {
              return (
                <div
                  class="container mx-auto w-1/2 lg:w-1/5 md:w-1/3 p-3"
                  key={i}
                >
                  <div class="w-full h-full p-4 ring ring-transparent rounded-lg min-h:full bg-green-800">
                    <img
                      class="opacity-0 object-scale-down"
                      src={seedTracks[0].album.images[0].url}
                    />
                    <div class="flex flex-row flex-wrap justify-around">
                      <p class="p-1 text-green-800 text-xs sm:text-sm md:text-base lg:text-lg">
                        {seedTracks[0].name} <br />{" "}
                        <i>by {seedTracks[0].artists[0].name}</i>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default DisplaySeeds;
