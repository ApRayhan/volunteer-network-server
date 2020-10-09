const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express()
const port = 5000

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxwvm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const volunteerWork = client.db("volunteerNetwork").collection("service");
  const allVolunteers = client.db("volunteerNetwork").collection("allVolunteers");
  
  app.get('/services', (req, res) => {
    volunteerWork.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/service/:key', (req, res) => {
    volunteerWork.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addVolunteer', (req, res) => {
    const newVolunteer = req.body;
    allVolunteers.insertOne(newVolunteer)
    .then(result => {
      res.send(result)
    })
  })

  app.get('/eventTask/:email', (req, res) => {
    allVolunteers.find({email: req.params.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/volunteerList', (req, res) => {
    allVolunteers.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)