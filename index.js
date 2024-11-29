const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
app.use(express.json());
app.use(cors());

//mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z7tru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

        const coffeeCollection = client.db("CoffeeShopDB").collection("coffee");
        const userCollection = client.db("CoffeeShopDB").collection("users");

        app.get('/coffee', async (req, res) => {
            let cursor = coffeeCollection.find()
            let result = await cursor.toArray()
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) }
            let result = await coffeeCollection.findOne(query);
            res.send(result)
        })
        app.post('/coffee', async (req, res) => {
            let newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        })
        app.put('/coffee/:id', async (req, res) => {
            let id = req.params.id
            let filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            let updateCoffee = req.body;
            let coffee = {
                $set: {
                    name: updateCoffee.name,
                    chef: updateCoffee.chef,
                    price: updateCoffee.price,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photoURL: updateCoffee.photoURL
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);

            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) }
            let result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        //Users Collection
        app.get('/users', async (req, res) => {
            let cursor = userCollection.find()
            let result = await cursor.toArray()
            res.send(result)
        })
        app.get('/users/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) }
            let result = await userCollection.findOne(query);
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            let newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        })
        app.patch('/users', async (req, res) => {
            let email = req.body.email
            let filter = { email }
            let updateUser = {
                $set: {
                    lastSignInTime:req.body?.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updateUser);

            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) }
            let result = await userCollection.deleteOne(query);
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
    res.send('Coffe store server is runing!')
})

app.listen(port, () => {
    console.log(`Coffee store runing on port ${port}`)
})