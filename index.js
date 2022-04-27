require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const { MongoClient, ObjectId} = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.msj15.mongodb.net/ShoppingMall?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.use(cors(corsOptions));
// below line is there so i can link the css file properly. 
app.use(express.static(path.join(__dirname, '/public')));

client.connect(err => {
  // const collection = client.db("ShoppingMall").collection("allProducts");
 const collection = client.db("ShoppingMall").collection("allProducts");
 const usercollection = client.db("ShoppingMall").collection("users");
//  Don't need this newcollection for now
//  const newcollection = client.db('ShoppingMall').collection('newcollection');


  // middleware
  const paginatedFunction = ()=> {
    return (req, res)=> {
      const result = {};
      const property = req.query.property;
      const value = req.query.value;
      
      let query = {}
      query[property]= value;
      let count;
      // this function to get how many product is there of the same kind, then sets it into count variable to later use to show next or previous page
      async function setCount() {
        const number = await collection.find(query).count()
        count = number;
      }
      setCount()
      let page = parseFloat(req.query.page) || 1;
      let limit= 10;
      const startIndex = (page-1)*limit;
      let endIndex = page * limit;
      collection.find(query).limit(limit).skip((page-1)*limit).toArray((err, documents)=> {
       
        if(endIndex< count){
          result.next = page +1;
        }
        if(startIndex> 0){
          result.previous = page-1;
        }
        result.result = documents;
        res.send(result)
      })
    }
  };

 
  // perform actions on the collection object
  app.get('/allProducts', (req,res)=>{
    collection.find().toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.post('/add-product', (req, res)=>{
    collection.insertOne(req.body)
    res.send('added')
  })
  app.get('/allusers', (req, res)=> {
    usercollection.find().toArray((err, documents)=> {
      res.send(documents)
    })
  })
  app.get('/user/:email', (req, res)=> {
    usercollection.find({email: `${req.params.email}`}).toArray((err, documents)=> {
      res.send(documents[0])
    })
  })

  app.post('/add-user', (req, res)=> {
    usercollection.insertOne(req.body)
    res.send('user updated')
  })

  app.patch('/update-cart/:id', (req, res)=> {
    const updateobject = {cart: req.body};
    usercollection.updateOne({_id:ObjectId(`${req.params.id}`)}, {$set: updateobject})
  })
  

  app.delete('/delete/:id',(req, res)=>{
    collection.deleteOne({_id:ObjectID(`${req.params.id}`)})
  })

  app.delete('/delete-user/:email', (req, res)=> {
    usercollection.deleteOne({email: `${req.params.email}`})
    res.send('deleted')
  })

  // specific category product with page system
  // here paginatedFunction is a middleware written above
  app.get('/items', paginatedFunction())


  // get four items from a category
  app.get("/category/:productType", (req, res) => {
    collection
      .find({ category: req.params.productType })
      .sort({ starCount: -1 })
      .limit(4)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  // an endpoint to show one item by its id
  app.get("/product/:id", (req, res) => {
    const id = req.params.id;
    collection.find({ _id: ObjectId(`${id}`) }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  // an endpoint to show most bought items(most stars), 
  app.get("/popular-items", (req, res) => {
    collection
      .find()
      .sort({ starCount: -1 })
      .limit(10)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

});



app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname + '/public/views/main.html'))
});
app.listen(process.env.PORT || 5000, ()=>console.log('successfully running'));