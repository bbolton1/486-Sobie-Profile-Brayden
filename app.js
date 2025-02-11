// MONGO_URI = "mongodb+srv://Brayden:<password>@cluster1.tr3ov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const mongoCollection = client
.db("braydenSobieDb")
.collection("sobieDbColl");
// .db("rock-song-database")
// .collection("rock-song-names");

function initProfileData() {

  mongoCollection.insertOne({

    title: "page title",
    post: "this is the post"
  });

}

//initProfileData();


app.get('/', async function (req,res) {

  let results = await mongoCollection.find({}).toArray();

  res.render('profile',
    {profileData: results});

})

// begin all middleware

app.get('/insert', async (req,res)=> {


  console.log('in /insert');
  
  //let newSong = req.body.myName; //only for POST, GET is req.params? 

  let newSong = req.query.myName;

  //connect to db,
  await client.connect();
  //point to the collection 
  await client
    .db("rock-song-database")
    .collection("rock-song-names")
    .insertOne({ song_name: "hi"});

  res.redirect('/read');

}); 

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

//function below also works with app.post by changing method on form to post and changing the line to console.log(req.body) 

app.post('/delete/:id', async (req,res)=>{

  console.log("in delete, req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("rock-song-database").collection
  ("rock-song-names");
  let result = await collection.findOneAndDelete( 
    {
      "_id": new ObjectId(req.params.id)
    }
  )
  
    .then(result => {
  console.log(result); 
  res.redirect('/read');})

  

})

app.post('/update', async (req,res)=>{

  console.log("req.body: ", req.body)

  client.connect; 
  const collection = client.db("rock-song-database").collection("rock-song-names");
  let result = await collection.findOneAndUpdate( 
  {"_id": new ObjectId(req.body.nameID)}, 
  { $set: {song_name: "asdf"}}
)
.then(result => {
  console.log(result); 
  res.redirect('/read');
})
}); 

app.listen(
  port,
  () => console.log(`server is running on ... local host ${port}`)
)

