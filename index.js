const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.nqqpx5x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const addBooksCollection = client.db('assignmenttwelve').collection('books');
        const usersCollection = client.db('assignmenttwelve').collection('users');
        const regisCollection = client.db('assignmenttwelve').collection('regisusers');

        // Add Books Data
        app.post('/books', async (req, res) => {
            const books = req.body;
            const result = await addBooksCollection.insertOne(books);
            res.send(result);
        });

        app.get('/books', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });

        // Add User Data from Client Site
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = usersCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });


        // Add Registration Uer on the Database
        app.post('/regisusers', async (req, res) => {
            const regisusers = req.body;
            const result = await regisCollection.insertOne(regisusers);
            res.send(result);
        });

        
        app.get('/regisusers', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = regisCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });
        
        app.delete('/regisusers/delete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await regisCollection.deleteOne(query);
            res.send(result);
        })
        
        
        // // Json Web Toke (JWT)
        // app.get('/jwt', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const user = await addPostCollection.findOne(query);
        //     if (user) {
        //         const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '1h' })
        //         return res.send({ accessToken: token });
        //     }
        //     res.status(403).send({ accessToken: '' });
        // });
        
    }
    finally { }

}
run().catch(error => console.log(error))



// Start Server Code
app.get('/', async (req, res) => {
    res.send("This is the Book Resale Server Site");
});

app.listen(port, async (req, res) => {
    console.log(`This Server ${port}`);
})