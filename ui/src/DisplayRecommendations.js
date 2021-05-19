
import React from "react";
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import Cookies from "js-cookie";


const DisplayRecommendations = ({ seedTracks, recommendations, updateRecommendations, deleteRecommendation, clearRecommendations }) => {

    function generateRecommendations(seedTracks, token_key) {
        
        let requestData = {
            limit: "25",
            seed_tracks: seedTracks,
            token: Cookies.get(token_key)
        };

        let url;
        if (process.env.NODE_ENV == "production") {
            url = "/api/recommendations";
        } else {
            url = "http://localhost:3001/api/recommendations";
        }

        $.ajax({
            url: url,
            dataType : 'json',
            data: requestData,
            type: "POST"
        }).done(function (data) {
            if (responseIsSuccess(data)) {
                if(recommendations.length > 0){
                    clearRecommendations(recommendations);
                }
                data.trackResult.tracks.forEach((track) => {updateRecommendations(recommendations, track);});
            }
        });
    }

    function responseIsSuccess(data) {
        let error;
        if (data && data.status) {
            error = data.status;
        } else {
            error = data.status.error.response.status || "401";
        }

        var message = data.message;

        if (error && parseInt(error) == 401) {
            alert(message);
            return false;
        }
        if (error && error >= 400) {
            alert(message || "Error: Please try logging in and out again.");
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
                            <div class="flex flex-row flex-wrap mx-8 my-4 px-4 py-4 ring ring-transparent rounded-lg bg-green-700">
                            {recommendations.map((track) => {
                                return(
                                    <div class="container mx-auto w-1/2 lg:w-1/5 md:w-1/3 p-3">
                                        <button class="w-full h-full p-4 ring ring-transparent rounded-lg bg-green-800 hover:bg-blue-500 active:bg-indigo-800" key={track.id}  onClick={() => deleteRecommendation(recommendations, track)}>
                                            <img src={track.album.images[0].url} class="object-scale-down"/>
                                            <div class="flex flex-row flex-wrap justify-around">
                                                <p class="p-1 text-xs sm:text-sm md:text-base lg:text-lg">{track.name} <br /> <i>by {track.artists[0].name}</i></p>
                                            </div>
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