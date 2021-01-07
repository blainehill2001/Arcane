import React, { Component, useEffect, useState } from "react";

function Welcome(){

    const token_key = 'arcane-token-key';

    // const [token, setToken] = useState('');

    function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    //console.log(hashParams);
    return hashParams;
    }

    useEffect(() => {
    // if(sessionStorage.getItem(token_key)){
    //   sessionStorage.removeItem(token_key);
    //   console.log("the session storage was cleared");
    // }
    var params = getHashParams();
    // setToken(params.access_token);
    if(params.access_token != null && params.access_token != ''){
        localStorage.setItem(token_key, params.access_token);
        console.log("The access token is "+params.access_token);
    }
    }, []);

    
    return(
        <section>
            <a href="http://localhost:8888/login">
                <button>
                    Log in with Spotify!
                </button>
            </a>
        </section>
    );
}


export default Welcome;