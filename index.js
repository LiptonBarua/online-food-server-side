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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const dataCollection = client.db('assianment').collection('services');
    const orderCollection = client.db('assianment').collection('orders');

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

    app.post('/service', async (req, res) => {
      const result = await dataCollection.insertOne(req.body);
      if (result.insertedId) {
        res.send({
          success: true,
          message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
        });
      }
    })

    // app.put('/rating', async (req, res) => {
    //   const serviceEmail = req.query._id;
    //   const body = req.body;
    //   const {_id, name, email, message, phote, rating, date } = body;
    //   const filter = { _id: serviceEmail }
    //   const option = { upsert: true }
    //   const updatedDoc = {
    //     $set: {
    //       name, email, message, phote, rating, date
    //     }
    //   }
    //   const result = await dataCollection.updateOne(filter, updatedDoc, option)
    //   res.send(result)
    // })

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