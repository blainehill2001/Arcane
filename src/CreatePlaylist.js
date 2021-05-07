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

        $.ajax({
            url: "/createPlaylist",
            dataType : 'json',
            data: requestData,
            type: "GET"
        }).done(function (response) {
            if (responseIsSuccess(response)) {

                let requestData2 ={
                    recommendation_ids: recommendation_ids,
                    playlist_id: response.data,
                    token: Cookies.get(token_key)
                }

                $.ajax({
                    url: "/addTracks",
                    dataType : 'json',
                    data: requestData2,
                    type: "GET"
                }).done(function(response2){
                    alert("Check out Spotify for your new Arcane Mix!");
                })
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