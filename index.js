const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('assianment project is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ebocqiq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const usersCollection = client.db('assianment').collection('users');
    const dataCollection = client.db('assianment').collection('services');
    const orderCollection = client.db('assianment').collection('orders');


  // .......................User Collection........................



  app.post('/users', async(req, res)=>{
    const user=req.body;
    const result= await usersCollection.insertOne(user);
    res.send(result)
  })

 app.get('/users', async(req, res)=>{
  const query={};
  const result=await usersCollection.find(query).toArray();
  res.send(result);
 })

 app.put('/profile', async(req, res)=>{
  const userEmail=req.query.email;
  const file=req.body;
  const{email, name, position, education, image}=file;
  const filter={email: userEmail};
  const option = { upsert: true }
  const updatedDoc={
    $set: {
      email, name, position, education, image
    }
  }
  const result = await usersCollection.updateOne(filter, updatedDoc, option);
  res.send(result)
 })
 
 app.get('/profile', async(req, res)=>{
  let query={};
  if(req.query.email){
    query={
      email:req.query.email
    }
  }

  const result= await usersCollection.find(query).toArray();
  res.send(result)
 })


 app.put('/color', async(req, res)=>{
  const userEmail=req.query.email;
  const file=req.body;
  const{color, email}=file;
  const filter={email: userEmail};
  const option = { upsert: true }
  const updatedDoc={
    $set: {
      color,email
    }
  }
  const result = await usersCollection.updateOne(filter, updatedDoc, option);
  res.send(result)
 })


 app.get('/color', async(req, res)=>{
  let query={};
  if(req.query.email){
    query={
      email:req.query.email
    }
  }

  const result= await usersCollection.find(query).toArray();
  res.send(result)
 })
  // .......................Service Collection........................

    app.get('/service', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size)
      const query = {};
      const cursor = dataCollection.find(query);
      const service = await cursor.skip(page * size).limit(size).toArray();
      const count = await dataCollection.estimatedDocumentCount();
      res.send({ count, service })
    })

    app.get('/cards', async (req, res) => {
      let query = {}
      if(req.query.email){
        query={
          email: req.query.email
        }
      }
      const result = await dataCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/services', async (req, res) => {
      const query = {}
      const result = await dataCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const services = await dataCollection.findOne(query);
      res.send(services);
    })

    app.delete('/service/:id', async(req, res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result=await dataCollection.deleteOne(query)
      res.send(result)
    })


    app.post('/service', async(req, res)=>{
      const service=req.body;
      const result=await dataCollection.insertOne(service);
      res.send(result)
    })



    app.post('/rating', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })
    app.get('/rating', async (req, res) => {
      const query = {};
      const result = await orderCollection.find().toArray();
      res.send(result)
    })
    app.get('/myReview', async (req, res) => {
      const email = req.query.email;
      let query = { email: email }
      const result = await orderCollection.find(query).toArray();
      res.send(result)
    })

    app.delete('/myReview/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })
  }
  finally {

  }

}
run().catch(error => console.log(error))

app.listen(port, (req, res) => {
  console.log(`assiament is running ${port}`)
})