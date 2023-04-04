require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: '3fdd1aa803d742fbbe04018031f15ea8',
  clientSecret: '95be4619a2904e76ae10b02b67b5ff7f'
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

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
    console.log(res1)
    res.render('artist-search-results', {aName: res1.name, aImg:im1.url})



    //console.log('The received data from the API: ', data.body);
    //console.log('I HAVE NO IDEA WHAT THE FUCK IM DOING',data)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
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
