
const express = require('express');
const app = express();
const cors = require('cors');

// new user and password is newuser and newuser
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://masumdb:passwordforatlas@cluster0.msj15.mongodb.net/ShoppingMall?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());


client.connect(err => {
  // const collection = client.db("ShoppingMall").collection("allProducts");
 const all = client.db("ShoppingMall").collection("allProducts");
  // perform actions on the collection object
  app.get('/allProducts', (req,res)=>{
    all.find({}).toArray((err, documents)=>{
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
  res.send('server running ')
});
app.listen(5000, ()=>console.log('successfully running'));