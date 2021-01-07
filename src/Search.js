import React from "react";
import $ from 'jquery';

function Search(){

    function searchTrackByName(track_name, token_key = 'arcane-token-key') {
        //console.log(localStorage.getItem(token_key));
        $.ajax({
            url: "/trackSearch",
            data: {
                track_value: track_name,
                token: localStorage.getItem(token_key)
            }
        }).done(function (data) {
            console.log("chocolates are delicious");
            console.log(data);
            if (responseIsSuccess(data.trackResult)) {
                // trackResult = data.trackResult.tracks.items;
                // displaySearchResults(trackResult);
                console.log("Potatoes are delicious");
            }
        });
    }

    function responseIsSuccess(data, token_key = 'arcane-token-key') {
        // var error;
        // if (data && !data.error) {
        //     error = data.status;
        // } else {
        //     error = data.status.error.status || "401";
        // }
        var error;
        if(data.isError){
            error = data.status || "401";
        }
        console.log(error);

        var msg = data.message;
        // if unauthorized we need to prompt log in
        if (error && parseInt(error) == 401) {
            alert(msg);
            localStorage.removeItem(token_key);
            return false;
        }
        if (error && parseInt(error >= 400)) {
            alert(msg || "Error: Please try logging in and out again.");
            return false;
        }
        return true;
    }

    return(
        <section>
                <button onClick={() => searchTrackByName('3n3Ppam7vgaVa1iaRUc9Lp')}>
                    Search Here for this track
                </button>
        </section>
    );
}


export default Search;