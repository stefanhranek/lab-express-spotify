require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");  //  REQUIRE SPOTIFY API

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//////////////// SETTING SPOTIFY API :
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

/////////////// RETRIEVE API ACCESS TOKEN :
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });



////////////// ROUTES :

app.get('/', (req,res,next) => {
    console.log('Home page loaded');
    
    res.render('index');
})

app.get('/artists',(req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artists)
        .then(data => {
            console.log("The received data from the API: ", data.body.artists.items );
        res.render("artists", { artists: data.body.artists.items });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
    //console.log(req.params.artists, req.query.artists);
});


app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log("ALBUM DATA: ", data);
        res.render("albums", { albums: data.body.items });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});


app.get('/tracks', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log("TRACK DATA:  ", data);
        res.render("tracks", { tracks: data.body.items });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
