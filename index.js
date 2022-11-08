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

     app.get('/service', async(req, res)=>{
        const query ={};
        const cursor = dataCollection.find(query);
        const service = await cursor.toArray();
        // const count =await dataCollection.estimatedDocumentCount();
        res.send(service)
     })

       app.get('/service/:id', async(req, res)=>{
        const id =req.params.id;
        const query = {_id:ObjectId(id)}
        const services = await dataCollection.findOne(query);
        res.send(services);
     })
    }
    finally{

    }

}
run().catch(error=>console.log(error))

app.listen(port, (req, res)=>{
    console.log(`assiament is running ${port}`)
})