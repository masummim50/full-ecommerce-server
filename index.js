require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path')

// new user and password is newuser and newuser
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.msj15.mongodb.net/ShoppingMall?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());
// below line is there so i can link the css file properly. 
app.use(express.static(path.join(__dirname, '/public')));

client.connect(err => {
  // const collection = client.db("ShoppingMall").collection("allProducts");
 const all = client.db("ShoppingMall").collection("allProducts");
 const newcollection = client.db('ShoppingMall').collection('newcollection');
 
  // perform actions on the collection object
  app.get('/allProducts', (req,res)=>{
    all.find().limit(20).toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res)=> {
    let id = req.params.id;
    all.find({_id:ObjectID(`${id}`)}).toArray((err, documents)=> {
      res.send(documents[0])
    })
  })

  app.get('/category/:categoryType', (req, res)=> {
    all.find({category:`${req.params.categoryType}`})
    .toArray((err, documents)=> {
      res.send(documents)
    })
  })

  app.get('/seller/:brandName', (req, res)=> {
    let brand = req.params.brandName;
    all.find({seller:brand}).toArray((err, documents)=> {
      res.send(documents)
    })
  })

  app.get('/allProducts/showing/:number', (req, res)=>{
    let number = req.params.number;
    all.find().limit(10).skip(parseInt(number)).toArray((err, documents)=>{
      res.send(documents)
    })
  })


  app.post('/add-product', (req, res)=>{
    all.insertOne(req.body)
    res.send('added')
  })
  

  app.delete('/delete/:id',(req, res)=>{
    all.deleteOne({_id:ObjectID(`${req.params.id}`)})
  })


});



app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname + '/public/views/main.html'))
});
app.listen(5000, ()=>console.log('successfully running'));