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
var path = require('path');

var port = 3001;
var client_id = process.env.REACT_APP_CLIENT_ID; // Client ID
var client_secret = process.env.REACT_APP_CLIENT_SECRET; // Client Secret
var redirect_uri = "http://localhost:" + port + "/api/callback"; // Client Redirect Uri

//if in prod, set port and redirect_uri appropriately
if (process.env.NODE_ENV == "production") {
    port = process.env.PORT;
    redirect_uri = process.env.SPOTIFY_CALL_BACK_URI;
}

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

app.use(express.static(path.join(__dirname, 'ui/build')))
    .use(helmet())
    .use(compression())
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.json({limit: '150mb', extended: "true", parameterLimit: 1000000}))
    .use(bodyParser.urlencoded({limit: '150mb', extended: "true", parameterLimit: 1000000}));

app.get('/api/login', function(req, res) {

    var state = generateRandomString(16);
    res.clearCookie(stateKey);
    res.cookie(stateKey, state);

    var scope = 'playlist-modify-public playlist-modify-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: true
        }));
});

app.get('/api/callback', function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.clearCookie(stateKey);
        if(process.env.NODE_ENV == "production"){
            res.redirect('/' +
            querystring.stringify({
                error: 'state_mismatch'
            })); 
        } else{
            res.redirect('http://localhost:3000/' +
            querystring.stringify({
            error: 'state_mismatch'
            }));
        }
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

            if(process.env.NODE_ENV == "production"){
                res.redirect('/#' +
                querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
                }));
            } else{
                res.redirect('http://localhost:3000/#' +
                querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
                }));
            }
        } else {
            res.clearCookie(stateKey);
            if(process.env.NODE_ENV == "production"){
                res.redirect('/' +
                querystring.stringify({
                    error: 'state_mismatch'
                })); 
            } else{
                res.redirect('http://localhost:3000/' +
                querystring.stringify({
                error: 'state_mismatch'
                }));
            }
        }
        });
    }
});

app.get("/api/trackSearch", function (req, res) {
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

app.post("/api/recommendations", function (req, res) {
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

app.get("/api/createPlaylist", function (req, res) {
    let desc = "Your Arcane playlist starring: ";
    for(let i = 0; i < req.query.seedTrack_names.length; i++){
        if(i == req.query.seedTrack_names.length-1 && req.query.seedTrack_names.length > 1){
            desc += "and ";
        }
        desc += req.query.seedTrack_names[i];
        if(i != req.query.seedTrack_names.length - 1){
            desc += ", ";
        }
    }

    axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
            Authorization: 'Bearer ' + req.query.token
        },
    })
        .then((response) => {
            let id = response.data.id;

            let url = "https://api.spotify.com/v1/users/" + id + "/playlists";

            const body = {
                name: "Arcane Mix",
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
            if(process.env.NODE_ENV == "production"){
                res.redirect('/' +
                querystring.stringify({
                    error: 'state_mismatch'
                })); 
            } else{
                res.redirect('http://localhost:3000/' +
                querystring.stringify({
                error: 'state_mismatch'
                }));
            }
        });
});

app.get("/api/addTracks", function (req, res) {
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
            message: "Please log out and in again.",
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
            message: "Something is wrong!",
            trackResult: null
        };
    }
}

console.log('Listening on port: '+ port);
app.listen(port);


