const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
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

/// jwt Verification Process
function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Unauthorizes access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        const addBooksCollection = client.db('assignmenttwelve').collection('books');
        const usersCollection = client.db('assignmenttwelve').collection('users');
        const regisCollection = client.db('assignmenttwelve').collection('regisusers');

        // ========================= AddBooksCollection Area =========================
        app.post('/books', async (req, res) => {
            const books = req.body;
            const result = await addBooksCollection.insertOne(books);
            res.send(result);
        });

        // This is a My booking Api Data with JWT
        app.get('/books', verifyJWT, async (req, res) => {
            const email = req.query.email;

            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const query = { email: email }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });


        app.get('/books/data/:id', async (req, res) => {
            const id = req.params.id;
            const singquery = { _id: ObjectId(id) };
            const singresult = await addBooksCollection.findOne(singquery);
            res.send(singresult);
        })

        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addBooksCollection.deleteOne(query);
            res.send(result);
        })


        app.put('/books/adsrun/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    adsrun: "adsrun"
                }
            }
            const result = await addBooksCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/books/categorie/freebook', async (req, res) => {
            const query = { categorie: 'freebook' }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });

        /// Specific books adsrun product API
        app.get('/books/adsrun', async (req, res) => {
            const query = { adsrun: 'adsrun' }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });


        // Specific Data Category:freebook load for UI
        app.get('/books/categorie/freebook', async (req, res) => {
            const query = { categorie: 'freebook' }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });

        // Specific Data Category:pdfbook load for UI
        app.get('/books/categorie/pdfbook', async (req, res) => {
            const query = { categorie: 'pdfbook' }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });

        // Specific Data Category:premiumbook load for UI
        app.get('/books/categorie/premiumbook', async (req, res) => {
            const query = { categorie: 'premiumbook' }
            const cursor = addBooksCollection.find(query);
            const booksdata = await cursor.toArray();
            res.send(booksdata);
        });


        // ============== usersCollection Area ==============

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

        /// Category Query from the Mongodb



        // =============== RegisCollection Area ==============

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

        /// User verified add on Database
        app.put('/regisusers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    verified: "verified"
                }
            }
            const result = await regisCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        /// User verified add on Database
        app.put('/regisusers/admin/:id', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail }
            const user = await regisCollection.findOne(query);
            if (user?.admin !== 'admin') {
                return res.status(403).send({ message: 'forbidden Access' })
            }
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    admin: "admin"
                }
            }
            const result = await regisCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })



        /// Admin Checking
        app.get('/regisusers/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await regisCollection.findOne(query);
            res.send({ isAdmin: user?.admin === 'admin' });
        })

        /// Seller Checking
        app.get('/regisusers/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await regisCollection.findOne(query);
            res.send({ isSeller: user?.seller === 'seller' });
        })



        app.get('/regisusers/seller/', async (req, res) => {
            const query = { role: 'seller' }
            const cursor = regisCollection.find(query);
            const allseller = await cursor.toArray();
            res.send(allseller);
        });

        app.get('/regisusers/seller/', async (req, res) => {
            const query = { role: 'seller' }
            const cursor = regisCollection.find(query);
            const allseller = await cursor.toArray();
            res.send(allseller);
        });
        app.get('/regisusers/customer/', verifyJWT, async (req, res) => {
            const query = { role: 'customer' }
            const cursor = regisCollection.find(query);
            const allseller = await cursor.toArray();
            res.send(allseller);
        });

        app.delete('/regisusers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await regisCollection.deleteOne(query);
            res.send(result);
        })


        // Json Web Toke (JWT)
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await regisCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' });
        });

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