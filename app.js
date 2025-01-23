const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

//function below also works with app.post by changing method on form to post and changing the line to console.log(req.body) 

app.get('/saveMyNameGet', (req,res)=>{
  console.log("did we hit the end point?");

  console.log(req.query);

  res.redirect('/ejs');
})

app.post('/saveMyName', (req,res)=>{
  console.log("did we hit the end point?");

  console.log(req.body);

  //res.render('example',
  //{pageTitle: req.body.myName});

})

app.get('/nodemon', function (req, res) {
  res.send('heheheha. grrr')
})

app.get('/ejs', function (req, res) {
  res.render('example')
})

app.get('/helloRender', function (req, res) {
  res.send('Hello Express from the real world<br><a href="/">back to home</a>')
})

app.listen(
  port,
  () => console.log(`server is running on ... local host ${port}`)
)

