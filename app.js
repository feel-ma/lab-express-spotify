require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/home', (req, res) => {
    res.render('index.hbs')
})


app.get('/artist-search', (req,res) =>{
    
    spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {

    const{ items:[res1]}=data.body.artists
    const{images:[im1]}= res1
    const x= res1.id
    res.render('artist-search-results', {aName: res1.name, aImg:im1.url, aId: res1.id})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req,res) =>{
/*     spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        const albums = data.body;
        res.render('albums',{ albums : albums })

        // Log the album data to the console
        console.log('ALBUM' ,albums);
    })
     */
    spotifyApi
.getArtistAlbums(req.params.artistId)
.then(data => {
    const albums = data.body.items.map(album => {
        return {
            name: album.name,
            images: album.images,
            id: album.id
        }
    });
    res.render('albums',{ albums : albums });
   // console.log('ALBUMS', albums);
})
//console.log(' artist id ',req.params.artistId)
})

app.get('/songs/:albumID', (req, res) =>{
  spotifyApi.getAlbumTracks(req.params.albumID)
  .then(data => {
    const songs = data.body.items.map(song =>{
      return{
        name: song.name,
        audio: song.preview_url
      }
    })
    res.render('songs',{ songs:songs})
    console.log(songs)

  })

})





/* app.get('/artist-search', (req, res) => {
    const artistName = req.query.artistName;
    spotifyApi.searchArtists(artistName)
      .then(data => {
        const artists = data.body.artists.items;
        res.render('artists.hbs', { artists });
      })
      .catch(err => console.log('Error searching artists:', err));
  }); */

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
