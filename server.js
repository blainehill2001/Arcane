//on heroku set a new environment variable NODE_ENV to 'production'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//here is where we will define the general authentication flow per Spotify's example

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var axios = require('axios');
var helmet = require("helmet");
var compression = require("compression");
var bodyParser = require('body-parser');

var port = 8888;
var client_id = process.env.REACT_APP_CLIENT_ID; // Your client id
var client_secret = process.env.REACT_APP_CLIENT_SECRET; // Your secret
var redirect_uri = "http://localhost:" + port + "/callback"; // Your redirect uri
//if in prod, set port and redirect_uri appropriately
if (process.env.NODE_ENV == "production") {
    port = process.env.PORT;
    redirect_uri = process.env.SPOTIFY_CALL_BACK_URI;
}

// axios.interceptors.request.use(req => {
//     console.log(`${req.method} ${req.url}`);
//     // Important: request interceptors **must** return the request.
//     return req;
//   });
  
//   axios.interceptors.response.use(res => {
//     console.log(res.data.json);
//     // Important: response interceptors **must** return the response.
//     return res;
//   });


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
var text = '';
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
}
return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

// app.use(function (req, res, next) {

//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(express.static(__dirname + '/public'))
    .use(helmet())
    .use(compression())
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.json({limit: '150mb', extended: "true", parameterLimit: 1000000}))
    .use(bodyParser.urlencoded({limit: '150mb', extended: "true", parameterLimit: 1000000}));

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.clearCookie(stateKey);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'playlist-modify-public playlist-modify-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
        }));
});

app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.clearCookie(stateKey);
        res.redirect('/' +
        querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
        };

        request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            // we can also pass the token to the browser to make requests from there
            res.redirect('/#' +
            querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
            }));
        } else {
            res.clearCookie(stateKey);
            res.redirect('/' +
            querystring.stringify({
                error: 'invalid_token'
            }));
        }
        });
    }
});

app.get("/trackSearch", function (req, res) {
    let url =
        "https://api.spotify.com/v1/search?" +
        querystring.stringify({
            q: req.query.track_value,
            limit: req.query.limit,
            type: "track"
        });

    axios({
        method: 'GET',
        url: url,
        headers: {
            Authorization: 'Bearer ' + req.query.token
        }
    })
        .then((response) => {
            if (response.data.tracks.total > 0) {
                res.json({
                    status: response.status,
                    message: "success",
                    trackResult: response.data
                });
            } else {
                res.json({
                    status: "404",
                    message: "Track not found"
                });
            }
        })
        .catch((error) => {
            res.send(handleError(error));
        });
});

app.post("/recommendations", function (req, res) {
    let requestData = {
        limit: req.body.limit,
        seed_tracks: querystring.escape(req.body.seed_tracks)
    };
    
    let url = 
                "https://api.spotify.com/v1/recommendations?" +
                querystring.stringify(requestData, null, null,{ encodeURIComponent: uri => uri });



    axios({
        method: 'GET',
        url: url,
        headers: {
            Authorization: 'Bearer ' + req.body.token
        }
    })
        .then((response) => {
            if (response.data.tracks.length > 0) {
                res.json({
                    status: response.status,
                    message: "success",
                    trackResult: response.data
                });
            } else {
                res.json({
                    status: "404",
                    message: "Tracks not found"
                });
            }
        })
        .catch((error) => {
            res.send(handleError(error));
        });
});


// Creates a playlist, then calls function to add songs to playlist
app.get("/createPlaylist", function (req, res) {

    let date = new Date();
    let dateStr = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    let name = "Arcane Mix";
    let desc =
        "Your Arcane playlist featuring: "+ req.query.seedTrack_names.reduce((acc, track) => {
            if(track == req.query.seedTrack_names[req.query.seedTrack_names.length -1] && req.query.seedTrack_names.length > 1){
                acc += "and ";
            }
            acc += track
            if(track != req.query.seedTrack_names[req.query.seedTrack_names.length -1] && req.query.seedTrack_names.length > 2){
                acc += ", ";
            }
            return acc;
          }, "");+"\n Created on " + dateStr;

    // get user profile information
    axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
            Authorization: 'Bearer ' + req.query.token
        },
    })
        .then((response) => {
            // on success get id and create playlist
            let id = response.data.id;

            let url = "https://api.spotify.com/v1/users/" + id + "/playlists";

            const body = {
                name: name,
                description: desc,
            };

            axios({
                method: "POST",
                url: url,
                data: body,
                headers: {
                    Authorization: 'Bearer ' + req.query.token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    res.json({
                        status: 201,
                        message: "Successfully created new playlist",
                        data: response.data.id,
                    });
                })
                .catch((error) => {
                    res.send(handleError(error));
                });
        })
        .catch((error) => {
            console.error("Failed to load user account: " + error);
            res.redirect('/' +
            querystring.stringify({
                error: 'invalid_token'
            }));
        });
});

// Add a list of tracks by id to a playlist by id
app.get("/addTracks", function (req, res) {
    let track_list = req.query.recommendation_ids;
    let playlistId = req.query.playlist_id;

    if (!playlistId || !track_list || track_list.length < 1) {
        return;
    }

    let url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

    for (let i = 0; i < track_list.length; i++) {
        track_list[i] = "spotify:track:" + track_list[i];
    }

    const body = {
        uris: track_list,
    };

    axios({
        method: "POST",
        url: url,
        data: body,
        headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + req.query.token,
        },
    })
        .then((response) => {
            res.json({
                status: response.status,
                message: "success",
            });
        })
        .catch((error) => {
            res.send(handleError(error));
        });
});



function handleError(error) {
    if (error.response.status == "401") {
        return {
            status: error.response.status,
            message: "The session has expired - please reload the page",
            trackResult: null
        };
    } else if (error.response.status == "400") {
        return {
            status: error.response.status,
            message: error.message,
            trackResult: null
        };
    } else {
        return {
            status: error.response.status,
            message: "Something went wrong, no idea what happened.",
            trackResult: null
        };
    }
}


console.log('Listening on port: '+ port);
app.listen(port);


