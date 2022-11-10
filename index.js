const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('assianment project is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ebocqiq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
     const dataCollection = client.db('assianment').collection('services');
     const orderCollection = client.db('assianment').collection('orders');

     app.get('/service', async(req, res)=>{
        const page =parseInt(req.query.page);
        const size =parseInt(req.query.size)
        const query ={};
        const cursor = dataCollection.find(query);
        const service = await cursor.skip(page*size).limit(size).toArray();
        const count = await dataCollection.estimatedDocumentCount();
        res.send({count, service})
     })

       app.get('/service/:id', async(req, res)=>{
        const id =req.params.id;
        const query = {_id:ObjectId(id)}
        const services = await dataCollection.findOne(query);
        res.send(services);
     })

     app.post('/service', async(req, res)=>{
        const result = await dataCollection.insertOne(req.body);
     })

     app.post('/orders', async(req, res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send(result); 
     })
     app.get('/orders', async(req, res)=>{
      let query = {}
      if(req.query.email){
        query={
            email: req.query.email
        }
      }
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
     })

     app.delete('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result);
  })
    }
    finally{

    }

}
run().catch(error=>console.log(error))

app.listen(port, (req, res)=>{
    console.log(`assiament is running ${port}`)
})