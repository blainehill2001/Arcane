import React from "react";
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import Cookies from "js-cookie";


const CreatePlaylist= ({ seedTracks, recommendations }) => {

    function generatePlaylist(seedTrack_names, recommendation_ids, token_key) {
        
        let requestData = {
            seedTrack_names: seedTrack_names,
            token: Cookies.get(token_key)
        };

        let url;
        if (process.env.NODE_ENV == "production") {
            url = "/api/createPlaylist";
        } else {
            url = "http://localhost:3001/api/createPlaylist";
        }

        $.ajax({
            url: url,
            dataType : 'json',
            data: requestData,
            type: "GET"
        }).done(function (response) {
            if (responseIsSuccess(response)) {

                let url2;
                if (process.env.NODE_ENV == "production") {
                    url2 = "/api/addTracks";
                } else {
                    url2 = "http://localhost:3001/api/addTracks";
                }


                let requestData2 ={
                    recommendation_ids: recommendation_ids,
                    playlist_id: response.data,
                    token: Cookies.get(token_key)
                }
                console.log(response.data);

                $.ajax({
                    url: url2,
                    dataType : 'json',
                    data: requestData2,
                    type: "GET"
                }).done(function(){
                    alert("Check out Spotify for your new Arcane mix!");
                })
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
            { recommendations.length > 0 &&
            <div>
                <br />
                <Button class="bg-gray-800" variant="secondary btn-lg" onClick={() => generatePlaylist(seedTracks.map( track => track.artists[0].name), recommendations.map( track => track.id), 'arcane-token-key')}>
                    Create Playlist!
                </Button>
                <br />
                <br />
            </div>
            }       
        </div>
        );
}

export default CreatePlaylist;