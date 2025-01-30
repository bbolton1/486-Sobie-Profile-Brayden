const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

console.log(uri)
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

//console.log(shajs('sha256').update())

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);

async function getData() {

  await client.connect();
  let collection = await client.db("rock-song-database").collection("rock-song-names");

  //let collection = await db.collection("posts");
  let results = await collection.find({}).toArray();
    //.limit(50)
    //.toArray();

  console.log(results);

  return results;

}

app.get('/read', async function (req,res) {
  let getDataResults = await getData();
  console.log(getDataResults);

  res.render('songs',
    {songData : getDataResults});

  //res.send(getDataResults);
})

// begin all middleware

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

//function below also works with app.post by changing method on form to post and changing the line to console.log(req.body) 

app.get('/saveMyNameGet', (req,res)=>{
  console.log("did we hit the end point?");

  console.log('req.query: ', req.query);

  let reqName = req.query.myNameGet;

  //res.redirect('/ejs');

  res.render('example', 
    {pageTitle: reqName}
  );
})

app.post('/saveMyName', (req,res)=>{
  console.log("did we hit the end point?");

  console.log(req.body);

  //res.render('example',
  //{pageTitle: reqName});

})

app.get('/nodemon', function (req, res) {
  res.send('heheheha. grrr')
})

app.get('/ejs', function (req, res)
  {res.render('example', 
    {pageTitle: 'hello'})
});

app.get('/helloRender', function (req, res) {
  res.send('Hello Express from the real world<br><a href="/">back to home</a>')
})

app.listen(
  port,
  () => console.log(`server is running on ... local host ${port}`)
)

