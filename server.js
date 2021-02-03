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
//var jquery = require('jquery');
var axios = require('axios');
const helmet = require("helmet");
const compression = require("compression");

var port = 8888;
var client_id = process.env.REACT_APP_CLIENT_ID; // Your client id
var client_secret = process.env.REACT_APP_CLIENT_SECRET; // Your secret
var redirect_uri = "http://localhost:" + port + "/callback"; // Your redirect uri
//if in prod, set port and redirect_uri appropriately
if (process.env.NODE_ENV == "production") {
    port = process.env.PORT;
    redirect_uri = process.env.SPOTIFY_CALL_BACK_URI;
}





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

app.use(express.static(__dirname + '/public'))
    .use(helmet())
    .use(compression())
    // .use(jquery())
    .use(cors())
    .use(cookieParser());

app.get('/login', function(req, res) {

var state = generateRandomString(16);
res.cookie(stateKey, state);

// your application requests authorization
var scope = 'user-read-private user-read-email';
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
    res.redirect('http://localhost:3000/' +
    querystring.stringify({
        error: 'state_mismatch'
    }));
} else {
    res.clearCookie(stateKey);
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

        var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
        console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/#' +
        querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
        }));
    } else {
        res.redirect('http://localhost:3000/' +
        querystring.stringify({
            error: 'invalid_token'
        }));
    }
    });
}
});

//   app.get('/refresh_token', function(req, res) {

//     // requesting access token from refresh token
//     var refresh_token = req.query.refresh_token;
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//       form: {
//         grant_type: 'refresh_token',
//         refresh_token: refresh_token
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         var access_token = body.access_token;
//         res.send({
//           'access_token': access_token
//         });
//         console.log("THIS WORKED!!!!");
//       }
//     });
//   });


//end of Spotify authentication flow

//Below are functions used in grabbing data from that API

// Generate up to 50 recommended songs given params
// app.get("/recommendations", function (req, res) {
//     let requestData = {
//         seed_artists: req.seed_artists,
//         seed_tracks: req.seed_tracks,
//         target_popularity: req.popular
//     };

//     let url =
//         "https://api.spotify.com/v1/recommendations?" +
//         querystring.stringify(requestData);

//     axios({
//         method: "get",
//         url: url,
//         headers: {
//             Authorization: 'Bearer ' + req.query.token
//         }
//     })
//         .then((response) => {
//             res.json({
//                 status: response.status,
//                 message: "success",
//                 trackResult: response.data
//             });
//         })
//         .catch((error) => {
//             console.log("Recommendations Failed: " + error);
//             res.send(handleError(error));
//         });
// });

app.get("/trackSearch", function (req, res) {
    let url =
        //"https://api.spotify.com/v1/search?q=abba&type=track&market=US";
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

function handleError(error) {
    // console.log(error);
    if (error.response.status == "401") {
        return {
            status: error.response.status,
            message: "Token time out please log in again",
            trackResult: null
        };
    } else if (error.response.status == "429") {
        return {
            status: error.response.status,
            message: "Too many requests. Please try again in a few minutes.",
            trackResult: null
        };
    } else if (error.response.status == "400") {
        return {
            status: error.response.status,
            message: error.message,
            trackResult: null
        };
    }else {
        return {
            status: error.response.status,
            message: "Something went wrong, no idea what happened. You're on your own!",
            trackResult: null
        };
    }
}


console.log('Listening on port: '+ port);
app.listen(port);


