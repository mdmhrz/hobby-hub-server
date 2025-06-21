require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());



// MongoDB 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterofrazu.6jqzkwj.mongodb.net/?retryWrites=true&w=majority&appName=clusterOfRazu`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const groupCollection = client.db('groupsDB').collection('groups')


        // Get method to get groups Data form DB
        app.get('/groups', async (req, res) => {
            const result = await groupCollection.find().toArray();
            res.send(result);
        })

        // Get or Read Data by GET Method R of CRUD only Specific one
        app.get('/groups/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await groupCollection.findOne(query);
            res.send(result);
        })

        // Post method for create group
        app.post('/groups', async (req, res) => {
            const newGroup = req.body;
            console.log(newGroup);
            const result = await groupCollection.insertOne(newGroup)
            res.send(result);
        });



        // Delete Data by DELETE Method D of CRUD
        app.delete('/groups/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await groupCollection.deleteOne(query);
            res.send(result)
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('HobbyHub is on sky');
})

app.listen(port, () => {
    console.log(`hobbyHub Serveris running in the port${port}`)
});