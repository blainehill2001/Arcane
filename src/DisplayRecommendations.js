import React from "react";
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import Cookies from "js-cookie";


const DisplayRecommendations = ({ seedTracks, recommendations, updateRecommendations, deleteRecommendation }) => {

    function generateRecommendations(seedTracks, token_key) {
        
        let requestData = {
            limit: "25",
            seed_tracks: seedTracks,
            token: Cookies.get(token_key)
        };

        $.ajax({
            url: "/recommendations",
            dataType : 'json',
            data: requestData,
            type: "POST"
        }).done(function (data) {
            if (responseIsSuccess(data)) {
                data.trackResult.tracks.forEach((track) => {updateRecommendations(recommendations, track);});
            }
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
                    <div>
                        <br />
                        <Button class="bg-gray-800" variant="secondary btn-lg" onClick={() => generateRecommendations(seedTracks.map( track => track.id), 'arcane-token-key')}>
                            Get Recommendations!
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        { recommendations.length > 0 &&
                            <div class="flex flex-row flex-wrap mx-16 my-4 px-4 py-4 ring rounded-lg">
                            {recommendations.map((track) => {
                                return(
                                    <div class="container mx-auto w-1/5 p-3">
                                        <button class="object-cover w-auto h-auto p-3 ring rounded-lg hover:bg-blue-500 active:bg-green-800" key={track.id}  onClick={() => deleteRecommendation(recommendations, track)}>   
                                            <img src={track.album.images[0].url} />
                                            <p class="text-base md:text-lg sm:text-sm">{track.name} <br /> <i>by {track.artists[0].name}</i></p>
                                        </button>
                                        <br />
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