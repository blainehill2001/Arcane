import React, { useState } from "react";
import $ from 'jquery';
import { Button } from 'react-bootstrap';


const DisplayRecommendations = ({ seedTracks }) => {

    const [recommendations, setRecommendations] = useState([]);
    const [generated, setGenerated] = useState(false);

    function generateRecommendations(seedTracks, token_key) {

        let requestData = {
            limit: 25,
            //seed_artists: seed_artists,
            seed_tracks: seedTracks,
            token: localStorage.getItem(token_key)
            
        };

        $.ajax({
            url: "/recommendations",
            data: requestData
        }).done(function (data) {
            if (responseIsSuccess(data)) {
                setGenerated(true);
                setRecommendations(data.trackResult);
                //recList_id = displayRecommendations(data.trackResult);
                //recList_cache = data.trackResult;
                //document.getElementById("explicit-button").checked = false;
            }
            // loading("rec-button", false, origText);
            // onRemoveSpinner();
            // playlistIsCreated = false;
            // explicitPlaylistIsCreated = false;
        });
    }

    function responseIsSuccess(data) {
        var error;
        if (data && data.status.error == null) {
            error = data.status;
        } else {
            error = data.status.error.response.status || "401";
        }

        var msg = data.message;
        // if unauthorized we need to prompt log in
        if (error && parseInt(error) == 401) {
            alert(msg);
            return false;
        }
        if (error && error >= 400) {
            console.log(msg);
            alert(msg || "Error: Please try logging in and out again.");
            return false;
        }
        return true;
    }

    return(
        <div>
            {seedTracks.length > 0 &&
                <div>
                    <br />
                    <Button class="bg-gray-800" type="submit" defaultValue="Submit" variant="secondary btn-lg" href="http://localhost:8888/recommendations">
                        Get Recommendations!
                    </Button>
                    <br />
                    <div>
                        {generated == true &&
                            <div class="flex flex-row mx-16 my-4 px-4 py-4 ring rounded-lg">
                            {recommendations.map((track) => {
                                return(
                                    <div class="container">
                                        <button class="object-cover w-full h-full p-4 ring rounded-lg hover:bg-blue-500 active:bg-green-800" key={track.id}>   
                                            <img src={track.album.images[0].url} />
                                            <p>{track.name} <br /> <i>by {track.artists[0].name}</i></p>
                                        </button>
                                    </div>
                                    );
                                })}
                        </div>
                        }
                    </div>

                </div>
            }
        </div>
    );
}

export default DisplayRecommendations;