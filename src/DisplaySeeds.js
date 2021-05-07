import React from "react";

const DisplaySeeds = ({ seedTracks, deleteSeed }) => {
    
    return(
        <div>
            {seedTracks.length > 0 &&
                <div>
                    <br />
                    Your Seeds are:
                    <br />
                    <div class="flex flex-row mx-16 my-4 px-4 py-4 ring rounded-lg">
                        {seedTracks.map((seedTrack) => {
                            return(
                                <div class="container" key={seedTrack.id}>
                                    <button name={seedTrack.name} class="object-cover w-full h-full p-4 ring rounded-lg hover:bg-blue-500 active:bg-green-800" onClick={() => deleteSeed(seedTracks, seedTrack)}>
                                        <img src={seedTrack.album.images[0].url} />
                                        <p>{seedTrack.name} <br /> <i>by {seedTrack.artists[0].name}</i></p>
                                    </button>
                                </div>
                            );
                            })}
                            {[...Array(5-(seedTracks.length || 0))].map((i) =>{
                                return(
                                    <div class="container" key={i}>
                                        <div class="object-cover w-full h-full p-4 ring rounded-lg min-h:full" />
                                    </div>
                                );
                            })
                        }
                        
                    </div>
                </div>
            }
        </div>
    );
}
export default DisplaySeeds;