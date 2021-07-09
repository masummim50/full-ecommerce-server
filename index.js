
const express = require('express');
const app = express();
const cors = require('cors');


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://newuser:newuser@cluster0.msj15.mongodb.net/ShoppingMall?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());

// const mongoose = require('mongoose');
// const client = mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));


// db.once('open', function() {
//   // we're connected!
//   const all = client.db("ShoppingMall").collection("allProducts");
//   app.get('/all', (req, res)=>{
//         res.send('connected successfully')
//       })
// });



client.connect(err => {
  // const collection = client.db("ShoppingMall").collection("allProducts");
 const all = client.db("ShoppingMall").collection("allProducts");
  // perform actions on the collection object
  app.get('/allProducts', (req,res)=>{
    all.find({}).toArray((err, documents)=>{
      res.send(documents)
    })
  })
});



app.get('/', (req, res)=>{
  res.send('server running ')
});
app.listen(5000, ()=>console.log('successfully running'));