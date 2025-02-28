const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));  // Express 4.16+ has built-in body parser
app.use(express.static(__dirname + '/public'));

// DB 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const mongoCollection = client.db("songs").collection("allSongs");

// The Good Stuff
app.get('/', async function (req, res) {
  let results = await mongoCollection.find({}).toArray();
  res.render('profile', { recommendedSongs: results });
});

// Update
app.post('/update', async (req, res) => {
  const { songId, songName } = req.body;

  console.log("Received data:", { songId, songName });

  // Validate to make sure is not bomb
  if (!songId || !ObjectId.isValid(songId)) {
    console.log("Invalid songId:", songId);
    return res.status(400).send("Invalid song ID");
  }

  const songObjectId = new ObjectId(songId);

  // Mongo part
  const updateResult = await mongoCollection.updateOne(
    { _id: songObjectId }, // Find the song 
    { $set: { song_name: songName } } // Update the song 
  );

  if (updateResult.matchedCount === 0) {
    console.log("No song found with the given ID.");
    return res.status(404).send("Song not found");
  }

  console.log("Song updated successfully:", updateResult);
  res.redirect('/');
});

// Insert
app.post('/insert', async (req, res) => {
  let song = req.body.recommendedSongName;

  // Check if the song already exists in the database
  let existingSong = await mongoCollection.findOne({ song_name: song });

  if (existingSong) {
    // If song exists update it
    await mongoCollection.updateOne(
      { song_name: song },
      { $set: { song_name: song } }
    );
  } else {
    // Makes sure it doesnt exist
    await mongoCollection.insertOne({ song_name: song });
  }

  res.redirect('/');
});

// Delete
app.post('/delete', async function (req, res) {
  const deleteId = req.body.deleteId;

  // Validate before deleting
  if (!ObjectId.isValid(deleteId)) {
    console.log('Invalid ObjectId:', deleteId);
    return res.redirect('/');
  }

  const result = await mongoCollection.findOneAndDelete({ _id: new ObjectId(deleteId) });

  if (!result.value) {
    console.log('No matching song found for deletion.');
  }

  res.redirect('/');
});

app.listen(port, () => console.log(`Server is running on localhost:${port}`));
